import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function chatGemini(prompt) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${prompt}`,
    });
    return response.text;
  } catch (error) {
    console.log("Getting Data from Gemini failed", error);
  }
}
 
export default chatGemini;
