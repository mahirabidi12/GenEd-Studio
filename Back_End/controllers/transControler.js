import chatGemini from "../utils/askGemini.js";
import { finalPrompt, firstPrompt } from "../utils/generatePrompt.js";
import { generateAudio } from "../utils/elevenLabHandling.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import uploadAudio from "../utils/urlGenerator.js";
import generateSyncVideo from "../utils/syncLogic.js";
import downloadVideoFromURL from "../utils/downloadVideo.js";


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
    // console.log(transcript)
    console.log(personaId);
    let videoUrl;
    if (personaId == 1) {
      videoUrl = `https://res.cloudinary.com/da9vakpof/video/upload/v1748139953/hp_x6zkle.mp4`;
    } else if (personaId == 2) {
      videoUrl = `https://res.cloudinary.com/da9vakpof/video/upload/v1748139933/nv_y70blj.mp4`;
    }
    // console.log(videoUrl)
    const promptFinal = finalPrompt(transcript);
    const response = await chatGemini(promptFinal);
    const finalResult = JSON.parse(response.replace(/```json|```/g, "").trim());

    //RESPONSE FROM ABDUR , THE VIDEO
    // const abdurRes = await fetch("http://localhost:8000/generate-left-video", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(finalResult),
    // });

    // const abdurJson = await abdurRes.json();
    // const abdurVidPath = abdurJson.output_path;


    //elevenlabslogic
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const audioFileName = `audio_${Date.now()}.mp3`;
    const audioOutputPath = path.join(
      __dirname,
      "../elevenLabsAudio",
      audioFileName
    );
    await generateAudio(transcript, "male", audioOutputPath); // or 'female'
    const audioUrl = await uploadAudio(audioOutputPath);


    //sync builup
    const syncedVideoUrl = await generateSyncVideo(videoUrl, audioUrl);
    console.log(`Sync Url ` , syncVideoUrl)
    await downloadVideoFromURL(syncedVideoUrl);

    res.send({message : 'Sucess'})
    //WE NEED TO SEND THE FINAL VIDEO TO THE FRONTEND

    // res.status(201).json(finalResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
