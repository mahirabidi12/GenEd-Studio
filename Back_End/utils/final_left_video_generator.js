import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import generateVideos from "./video_generator.js";
import convertLinesToAudio from "./audio_generator.js";
import generateImages from './image_generator.js';

const execPromise = promisify(exec);

async function processMediaChunks(chunks, outputDir) {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create unique temp directory based on output dir name
    const tempDir = path.join(outputDir, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const videoChunks = await chunks.filter(chunk => chunk.type === 'video');
    const imageChunks = await chunks.filter(chunk => chunk.type === 'image');
    const audioChunks = await chunks.map(chunk => ({ id: chunk.id, line: chunk.line }));
    console.log('image chunks', imageChunks);

    // Function to get audio duration using ffprobe
    async function getAudioDuration(audioFile) {
        try {
            const { stdout } = await execPromise(
                `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioFile}"`
            );
            return parseFloat(stdout.trim());
        } catch (error) {
            console.error(`Error getting duration for ${audioFile}:`, error);
            return 3; // Default duration as fallback
        }
    }

    // Function to convert an image to a video with duration matching the audio
    async function imageToVideo(imageFile, audioFile, outputFile) {
        try {
            const duration = await getAudioDuration(audioFile);
            await execPromise(
                `ffmpeg -y -loop 1 -i "${imageFile}" -i "${audioFile}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -t ${duration} "${outputFile}"`
            );
            return outputFile;
        } catch (error) {
            console.error(`Error converting image to video:`, error);
            throw error;
        }
    }

    // Function to add audio to a video
    async function addAudioToVideo(videoFile, audioFile, outputFile) {
        try {
            const duration = await getAudioDuration(audioFile);
            await execPromise(
                `ffmpeg -y -i "${videoFile}" -i "${audioFile}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest -t ${duration} "${outputFile}"`
            );
            return outputFile;
        } catch (error) {
            console.error(`Error adding audio to video:`, error);
            throw error;
        }
    }

    // Function to create a file list for ffmpeg concat
    function createConcatFile(fileList) {
        const concatFilePath = path.join(tempDir, 'concat_list.txt');

        // Use absolute paths to avoid confusion and normalize them for Windows
        const absolutePaths = fileList.map(file => {
            const absPath = path.resolve(file);
            // Ensure correct format for FFmpeg
            return absPath.replace(/\\/g, '/');
        });

        const content = absolutePaths.map(file => `file '${file}'`).join('\n');
        fs.writeFileSync(concatFilePath, content);
        return concatFilePath;
    }

    // Function to merge all videos
    async function mergeVideos(videoList, outputFile) {
        try {
            const concatFilePath = createConcatFile(videoList);

            // Debug the contents of the concat file
            console.log(`Concat file contents: ${fs.readFileSync(concatFilePath, 'utf8')}`);

            await execPromise(
                `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputFile}"`
            );
            return outputFile;
        } catch (error) {
            console.error(`Error merging videos:`, error);
            throw error;
        }
    }

    // Function to clean up temporary files
    function cleanupFiles(filesToDelete) {
        console.log("Cleaning up temporary files...");

        filesToDelete.forEach(file => {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    // console.log(`Deleted: ${file}`);
                }
            } catch (err) {
                console.error(`Error deleting file ${file}: ${err.message}`);
            }
        });

        // Also delete the concat file
        const concatFile = path.join(tempDir, 'concat_list.txt');
        if (fs.existsSync(concatFile)) {
            fs.unlinkSync(concatFile);
            // console.log(`Deleted concat file: ${concatFile}`);
        }

        // Try to remove temp directory if it's empty
        try {
            if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
                fs.rmdirSync(tempDir);
                // console.log(`Removed empty temp directory: ${tempDir}`);
            }
        } catch (err) {
            console.error(`Error removing temp directory: ${err.message}`);
        }
    }

    try {
        console.log("Generating videos...");
        const videoPromises = videoChunks.map(chunk =>
            generateVideos([chunk], outputDir).then(results => results[0])
        );

        // In parallel, generate images
        console.log("Generating images...");
        const imagePromises = imageChunks.map(chunk =>
            generateImages([chunk], outputDir).then(results => results[0])
        );

        // Also in parallel, generate audio
        console.log("Converting lines to audio...");
        const audioPromises = audioChunks.map(chunk =>
            convertLinesToAudio([chunk], outputDir).then(results => results[0])
        );

        // Wait for all promises to resolve
        const [videoResults, imageResults, audioResults] = await Promise.all([
            Promise.all(videoPromises),
            Promise.all(imagePromises),
            Promise.all(audioPromises)
        ]);

        console.log("Video generation complete:", videoResults);
        console.log("Image generation complete:", imageResults);
        console.log("Audio conversion complete:", audioResults);

        // Create a map for quick lookup of media files by ID
        const mediaMap = new Map();

        // Add videos to the map
        videoResults.forEach(result => {
            mediaMap.set(result.id, {
                type: 'video',
                path: result.path
            });
        });

        // Add images to the map
        imageResults.forEach(result => {
            mediaMap.set(result.id, {
                type: 'image',
                path: result.path
            });
        });

        // Create a map for audio files
        const audioMap = new Map();
        audioResults.forEach(result => {
            audioMap.set(result.id, result.path);
        });

        console.log("Processing each chunk and combining with audio...");
        const processedVideos = [];
        const tempFilesToCleanup = [];

        // Process each chunk in order of ID
        for (let i = 1; i <= chunks.length; i++) {
            const media = mediaMap.get(i);
            const audioFile = audioMap.get(i);

            if (!media || !audioFile) {
                console.error(`Missing media or audio for ID ${i}`);
                continue;
            }

            const outputFile = path.join(tempDir, `processed_${i}.mp4`);

            if (media.type === 'image') {
                console.log(`Converting image ${i} to video with audio...`);
                await imageToVideo(media.path, audioFile, outputFile);
            } else { // video
                console.log(`Adding audio to video ${i}...`);
                await addAudioToVideo(media.path, audioFile, outputFile);
            }

            // Verify the file was created
            if (fs.existsSync(outputFile)) {
                console.log(`Successfully created: ${outputFile}`);
                processedVideos.push({
                    id: i,
                    path: outputFile
                });
                tempFilesToCleanup.push(outputFile);
            } else {
                console.error(`Failed to create: ${outputFile}`);
            }
        }

        // Sort processed videos by ID and get the list of paths
        const sortedVideoPaths = processedVideos
            .sort((a, b) => a.id - b.id)
            .map(item => item.path);

        console.log("Videos to be merged:", sortedVideoPaths);

        // Merge all processed videos
        console.log("Merging all videos...");
        const finalOutput = path.join(outputDir, 'final_video.mp4');
        await mergeVideos(sortedVideoPaths, finalOutput);

        console.log(`Final video created successfully: ${finalOutput}`);

        // Clean up all temporary files and original media files
        cleanupFiles([
            ...tempFilesToCleanup,
            ...videoResults.map(r => r.path),
            ...imageResults.map(r => r.path),
            ...audioResults.map(r => r.path)
        ]);

        return finalOutput;
    } catch (error) {
        console.error("Error in processing media chunks:", error);
        throw error;
    }
}

export default processMediaChunks;

// Example usage:
// import processMediaChunks from './media_processor.js';

// const chunks = [
//     {
//         "id": 1,
//         "line": "Welcome to the fascinating world of the human brain!",
//         "type": "video",
//         "prompt": "A colorful, dynamic animation showing the words 'The Human Brain' appear and zoom into a 3D model of a brain with glowing sections."
//     },
//     {
//         "id": 2,
//         "line": "Think of it as your body's command center.",
//         "type": "image",
//         "prompt": "A simple illustration of a control room with levers and screens, labeled 'The Body's Command Center,' and a cartoon brain character at the controls."
//     },
//     {
//         "id": 3,
//         "line": "The brain is divided into sections, the largest being the cerebrum.",
//         "type": "image",
//         "prompt": "A labeled diagram of the brain showing the cerebrum highlighted in a bright color."
//     },
//     {
//         "id": 4,
//         "line": "The cerebrum handles higher-level functions.",
//         "type": "video",
//         "prompt": "Animation showing the cerebrum glowing and expanding, representing higher-level cognitive functions."
//     },
//     {
//         "id": 5,
//         "line": "The frontal lobe is for decision-making and personality.",
//         "type": "image",
//         "prompt": "A diagram of the brain highlighting the frontal lobe with icons representing decision-making (e.g., a judge's gavel) and personality (e.g., a smiling face)."
//     },
//     {
//         "id": 6,
//         "line": "The parietal lobe processes sensory information like touch.",
//         "type": "video",
//         "prompt": "Animation of the parietal lobe being stimulated by a hand touching an object, showing the sensory information traveling to the brain."
//     },
//     {
//         "id": 7,
//         "line": "The temporal lobe is for memory and hearing.",
//         "type": "image",
//         "prompt": "A diagram highlighting the temporal lobe with icons representing memory (e.g., a photo album) and hearing (e.g., an ear)."
//     },
//     {
//         "id": 8,
//         "line": "The occipital lobe is for vision.",
//         "type": "video",
//         "prompt": "Animation of light entering the eyes and the signal traveling to the occipital lobe in the brain, processing the image."
//     },
//     {
//         "id": 9,
//         "line": "Neurons are specialized brain cells that transmit information.",
//         "type": "image",
//         "prompt": "A close-up diagram of a neuron with labeled parts like the cell body, axon, and dendrites."
//     },
//     {
//         "id": 10,
//         "line": "They transmit information via electrical and chemical signals.",
//         "type": "video",
//         "prompt": "Animation of electrical and chemical signals flowing between neurons in a brain network."
//     },
//     {
//         "id": 11,
//         "line": "This constant firing and rewiring is crucial for learning and memory.",
//         "type": "video",
//         "prompt": "Animation of neurons firing and forming new connections, representing the process of learning and memory formation."
//     },
//     {
//         "id": 12,
//         "line": "The limbic system is the emotional powerhouse!",
//         "type": "image",
//         "prompt": "A colorful diagram of the limbic system with labels for key structures like the amygdala and hippocampus, with visual cues of emotions."
//     },
//     {
//         "id": 13,
//         "line": "The amygdala processes emotions, especially fear.",
//         "type": "video",
//         "prompt": "Animation showing the amygdala lighting up as a person experiences a scary situation."
//     },
//     {
//         "id": 14,
//         "line": "The hippocampus is key for forming new memories.",
//         "type": "image",
//         "prompt": "A diagram of the hippocampus with images of memories being stored inside."
//     },
//     {
//         "id": 15,
//         "line": "The brain has plasticity, meaning it can reorganize itself.",
//         "type": "video",
//         "prompt": "Animation showing the brain with connections forming and reforming, demonstrating plasticity."
//     },
//     {
//         "id": 16,
//         "line": "It can form new neural connections throughout life.",
//         "type": "image",
//         "prompt": "Diagram of neurons with growing and branching connections, showing the brain's ability to adapt."
//     },
//     {
//         "id": 17,
//         "line": "It’s like a muscle; the more you use it, the stronger it gets!",
//         "type": "video",
//         "prompt": "Animation of a brain flexing like a muscle, growing larger and stronger as it's being used."
//     },
//     {
//         "id": 18,
//         "line": "Understanding the brain helps us treat neurological disorders.",
//         "type": "image",
//         "prompt": "Illustration of doctors examining a brain scan, representing the diagnosis and treatment of neurological disorders."
//     },
//     {
//         "id": 19,
//         "line": "It also helps us develop smarter AI.",
//         "type": "video",
//         "prompt": "Animation showing the brain connecting to a computer, representing the inspiration for AI development."
//     },
//     {
//         "id": 20,
//         "line": "The brain is constantly learning, adapting, and shaping who we are.",
//         "type": "image",
//         "prompt": "A collage of images representing learning, adapting, and personal growth, all connected to a central image of the brain."
//     }
// ];

// processMediaChunks(chunks, 'my_output_folder')
//     .then(finalVideoPath => console.log(`Video created at: ${finalVideoPath}`))
//     .catch(error => console.error("Error creating video:", error));