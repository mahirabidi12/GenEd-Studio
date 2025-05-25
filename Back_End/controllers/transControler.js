import chatGemini from "../utils/askGemini.js";
import { finalPrompt, firstPrompt ,  } from "../utils/generatePrompt.js";


 
export async function generateTranscript(req,res) {
    try {
        const {title , description , duration , targetAudience , ageGroup} = req.body;
        let prompt = firstPrompt({title , description , duration , targetAudience , ageGroup});
        const response = await chatGemini(prompt)
        // console.log(response)
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

export async function genFinalPrompt(req,res) {
    try {
        const {transcript,personaId} = req.body;
        videoUrl = null;
        if (personaId==1) {
            videoUrl = `https://res.cloudinary.com/da9vakpof/video/upload/v1748139953/hp_x6zkle.mp4`
        }
        else{
            videoUrl=`https://res.cloudinary.com/da9vakpof/video/upload/v1748139933/nv_y70blj.mp4`
        }
        
        const promptFinal = finalPrompt(transcript)
        const response = await chatGemini(promptFinal)
        console.log(response)



        // res.status(201).json(response)
    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
}