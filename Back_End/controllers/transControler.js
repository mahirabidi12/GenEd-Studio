import chatGemini from "../utils/askGemini.js";
import { firstPrompt } from "../utils/generatePrompt.js";


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

 