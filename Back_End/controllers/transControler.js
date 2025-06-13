import chatGemini from "../utils/askGemini.js";
import { finalPrompt, firstPrompt } from "../utils/generatePrompt.js";
// import { generateAudio } from "../utils/elevenLabHandling.js";
import { generateTTS } from "../utils/celebriumAudioGeneration.js";
import { mergeVideosSideBySide } from "../utils/videoUtils.js";
import { uploadVideoToCloudinary, deleteLocalFile } from "../utils/cloudinaryUtils.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from 'fs';
import uploadAudio from "../utils/urlGenerator.js";
import generateSyncVideo from "../utils/syncLogic.js";
import downloadVideoFromURL from "../utils/downloadVideo.js";
import processMediaChunks from "../utils/final_left_video_generator.js";
import { randomUUID } from "crypto";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function generateTranscript(req, res) {
  try {
    const { title, description, duration, targetAudience, ageGroup } = req.body;
    let prompt = firstPrompt({
      title,
      description,
      duration,
      targetAudience,
      ageGroup,
    });
    const response = await chatGemini(prompt);
    // console.log(response)
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function genFinalPrompt(req, res) {
  try {
    const { transcript, personaId } = req.body;

    if (!transcript) {
      throw new Error('Transcript is required in the request body');
    }

    console.log('Persona ID:', personaId);
    let videoUrl;
    if (personaId == 1) {
      videoUrl = `https://res.cloudinary.com/da9vakpof/video/upload/v1748139953/hp_x6zkle.mp4`;
    } else if (personaId == 2) {
      videoUrl = `https://res.cloudinary.com/da9vakpof/video/upload/v1748139933/nv_y70blj.mp4`;
    } else {
      throw new Error('Invalid personaId. Must be 1 or 2');
    }
    console.log('Using video URL:', videoUrl);

    // Generate final prompt using the transcript
    const promptFinal = finalPrompt(transcript);
    const response = await chatGemini(promptFinal);
    const finalResult = JSON.parse(response.replace(/```json|```/g, "").trim());
    // const finalResult = [
    //   {
    //     id: 1,
    //     line: 'Hey there, future botanists!',
    //     type: 'image',
    //     prompt: 'A group of diverse children wearing gardening gloves and looking excited in a sunny garden.'
    //   },
    //   {
    //     id: 2,
    //     line: 'Ever wonder how plants eat?',
    //     type: 'image',
    //     prompt: 'Close-up of a vibrant green plant with a question mark hovering above it.'
    //   },
    //   {
    //     id: 3,
    //     line: "They don't have a mouth, right?",
    //     type: 'image',
    //     prompt: 'Cartoon illustration of a plant with a surprised expression because it has no mouth.'
    //   },
    //   {
    //     id: 4,
    //     line: 'Well, plants are like tiny chefs.',
    //     type: 'image',
    //     prompt: "Illustration of a cute plant wearing a chef's hat, holding a tiny spatula."
    //   },
    //   {
    //     id: 5,
    //     line: 'They make their own food using a super cool process called photosynthesis.',
    //     type: 'video',
    //     prompt: "Animated text spelling out 'Photosynthesis' with sunlight rays shining brightly."
    //   },
    //   {
    //     id: 6,
    //     line: 'Think of it like this: the sun is their oven.',
    //     type: 'image',
    //     prompt: 'Illustration comparing the sun to an oven baking a cake, with plants nearby.'
    //   },
    //   {
    //     id: 7,
    //     line: 'Water from the ground is an ingredient.',
    //     type: 'video',
    //     prompt: 'Animation of water droplets rising from the soil towards the roots of a plant.'
    //   },
    //   {
    //     id: 8,
    //     line: "Carbon dioxide from the air, that's another key ingredient.",
    //     type: 'video',
    //     prompt: 'Animation showing carbon dioxide molecules floating from the air and being absorbed by plant leaves.'
    //   },
    //   {
    //     id: 9,
    //     line: 'Plants take all these things – sunlight, water, and carbon dioxide.',
    //     type: 'video',
    //     prompt: 'Animation of sunlight, water, and carbon dioxide symbols converging on a plant.'
    //   },
    //   {
    //     id: 10,
    //     line: 'And mix them together in their leaves.',
    //     type: 'video',
    //     prompt: 'Close-up animation of ingredients mixing inside a leaf, like a magical potion being brewed.'
    //   },
    //   {
    //     id: 11,
    //     line: 'Inside the leaves, there are these tiny green things called chloroplasts.',
    //     type: 'image',
    //     prompt: 'Detailed illustration of a plant leaf cell with chloroplasts highlighted in green.'
    //   },
    //   {
    //     id: 12,
    //     line: "They're like the plant's miniature kitchens.",
    //     type: 'image',
    //     prompt: 'Cartoon depiction of a chloroplast looking like a tiny kitchen, with miniature cooking equipment.'
    //   },
    //   {
    //     id: 13,
    //     line: "Using the sunlight's energy, the chloroplasts turn water and carbon dioxide into sugary food called glucose.",
    //     type: 'video',
    //     prompt: 'Animation showing chloroplasts converting water and carbon dioxide into glucose molecules with energy beams from the sun.'
    //   },
    //   {
    //     id: 14,
    //     line: 'The plant uses glucose for energy and growth.',
    //     type: 'video',
    //     prompt: 'Time-lapse animation of a plant growing taller and stronger as it consumes glucose.'
    //   },
    //   {
    //     id: 15,
    //     line: 'And as a bonus, they release oxygen, which is what we breathe!',
    //     type: 'video',
    //     prompt: 'Animation showing oxygen molecules being released from plant leaves into the air.'
    //   },
    //   {
    //     id: 16,
    //     line: 'So, plants take in sunlight, water, and carbon dioxide.',
    //     type: 'image',
    //     prompt: "Diagram showing arrows pointing towards a plant, labeled 'Sunlight', 'Water', and 'Carbon Dioxide'."
    //   },
    //   {
    //     id: 17,
    //     line: 'And they give us glucose and oxygen.',
    //     type: 'image',
    //     prompt: "Diagram showing arrows pointing away from a plant, labeled 'Glucose' and 'Oxygen'."
    //   },
    //   {
    //     id: 18,
    //     line: "That's photosynthesis in a nutshell!",
    //     type: 'image',
    //     prompt: 'Illustration of a plant inside a nutshell, representing the process of photosynthesis.'
    //   },
    //   {
    //     id: 19,
    //     line: 'Pretty neat, huh?',
    //     type: 'image',
    //     prompt: 'Cartoon plant winking and giving a thumbs up.'
    //   },
    //   {
    //     id: 20,
    //     line: 'Keep exploring!',
    //     type: 'video',
    //     prompt: 'Animation of various plants and flowers blooming and swaying in the wind, encouraging exploration.'
    //   }
    // ];
    console.log("Final Result:", finalResult);

    // Create audio transcript from the final result
    const audio_transcript = finalResult.map(item => item.line).join(" ");


    const output_path = path.join(
      __dirname,
      "output_" + randomUUID()
    );

    const left_video_path = await processMediaChunks(finalResult, output_path);



    // //elevenlabslogic
    // const audioFileName = `audio_${Date.now()}.mp3`;  
    // const audioOutputPath = path.join(
    //   output_path,
    //   audioFileName
    // );
    // await generateAudio(audio_transcript, "male", audioOutputPath);
    // const audioUrl = await uploadAudio(audioOutputPath);
    
    // custom celebrium logic
    console.log("Generating audio for the transcript...");
    const audioFileName = `audio_${Date.now()}.mp3`;  
    const audioOutputPath = path.join(
      output_path,
      audioFileName
    );
    await generateTTS(audio_transcript, "male", audioOutputPath);
    const audioUrl = await uploadAudio(audioOutputPath);


    // //sync builup
    const syncedVideoUrl = await generateSyncVideo(videoUrl, audioUrl);
    console.log(`Sync Url ` , syncedVideoUrl)
    await downloadVideoFromURL(syncedVideoUrl, output_path);


    // Paths to the input videos
    const leftVideoPath = path.join(output_path, 'final_video.mp4');
    const rightVideoPath = path.join(output_path, 'final_video2.mp4');
    
    try {
      // Check if both video files exist
      await fs.access(leftVideoPath);
      await fs.access(rightVideoPath);
      
      // Merge the videos
      const mergedVideoPath = await mergeVideosSideBySide(leftVideoPath, rightVideoPath, output_path);
      
      // Upload the merged video to Cloudinary
      const cloudinaryUrl = await uploadVideoToCloudinary(mergedVideoPath, 'merged_videos');
      
      // Clean up the local file after successful upload
      await deleteLocalFile(mergedVideoPath);
      
      // Send success response with the Cloudinary URL
      res.json({ 
        success: true, 
        message: 'Videos merged and uploaded successfully', 
        videoUrl: cloudinaryUrl 
      });
    } catch (error) {
      console.error('Error merging videos:', error);
      throw new Error(`Failed to merge videos: ${error.message}`);
    }

    // res.status(201).json(finalResult);
  } catch (error) {
    console.error("Error in genFinalPrompt:", error);
    res.status(400).json({ error: error.message });
  }
}
