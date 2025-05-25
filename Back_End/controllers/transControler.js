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
        const promptFinal = finalPrompt(transcript)
        const response = await chatGemini(promptFinal)
        console.log(response)
        // console.log(req.body)
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
}
 



