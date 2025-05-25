import chatGemini from "../utils/askGemini.js";
import { finalPrompt, firstPrompt } from "../utils/generatePrompt.js";
import { generateAudio } from "../utils/elevenLabHandling.js";
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

    // Create audio transcript from the final result
    const audio_transcript = finalResult.map(item => item.line).join(" ");


    const output_path = path.join(
      __dirname,
      "output_" + randomUUID()
    );

    const left_video_path = await processMediaChunks(finalResult, output_path);



    // //elevenlabslogic
    const audioFileName = `audio_${Date.now()}.mp3`;  
    const audioOutputPath = path.join(
      output_path,
      audioFileName
    );
    await generateAudio(audio_transcript, "male", audioOutputPath); // or 'female'
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
