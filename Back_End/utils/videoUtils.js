import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

/**
 * Merges two videos side by side using FFmpeg
 * @param {string} leftVideoPath - Path to the left video (will be muted)
 * @param {string} rightVideoPath - Path to the right video (will keep audio)
 * @param {string} outputDir - Directory where the output file will be saved
 * @returns {Promise<string>} - Path to the merged video file
 */
export const mergeVideosSideBySide = async (leftVideoPath, rightVideoPath, outputDir) => {
    try {
        const outputPath = path.join(outputDir, 'merged_output.mp4');
        
        // FFmpeg command to merge videos side by side
        // 1. Scale both videos to the same height (480p in this case, maintaining aspect ratio)
        // 2. Stack them horizontally
        // 3. Use the audio from the right video
        // 4. Set duration to match the right video
        const command = `ffmpeg \
            -i "${leftVideoPath}" \
            -i "${rightVideoPath}" \
            -filter_complex \
            "[0:v]scale=-1:480,setpts=PTS-STARTPTS[scaled_left]; \
             [1:v]scale=-1:480,setpts=PTS-STARTPTS[scaled_right]; \
             [scaled_left][scaled_right]hstack=inputs=2[v]; \
             [1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=1.0[a]" \
            -map "[v]" \
            -map "[a]" \
            -c:v libx264 \
            -preset veryfast \
            -crf 23 \
            -c:a aac \
            -b:a 192k \
            -shortest \
            -y \
            "${outputPath}"`;

        console.log('Executing FFmpeg command:', command);
        const { stdout, stderr } = await execPromise(command);
        
        if (stderr) {
            console.warn('FFmpeg stderr:', stderr);
        }
        
        console.log('Video merging completed successfully');
        return outputPath;
    } catch (error) {
        console.error('Error merging videos:', error);
        throw new Error(`Failed to merge videos: ${error.message}`);
    }
};

/**
 * Gets the duration of a video file in seconds
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<number>} - Duration in seconds
 */
const getVideoDuration = async (videoPath) => {
    try {
        const { stdout } = await execPromise(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`);
        return parseFloat(stdout.trim());
    } catch (error) {
        console.error(`Error getting video duration for ${videoPath}:`, error);
        throw new Error(`Failed to get video duration: ${error.message}`);
    }
};
