import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'

dotenv.config();
// male: am_eric, am_adam 
// female: af_bella, af_heart

const API_URL = process.env.CEREBRIUM_API_URL;
const CEREBRIUM_API_KEY = process.env.CEREBRIUM_API_KEY;

if (!API_URL || !CEREBRIUM_API_KEY) {
  throw new Error('CEREBRIUM_API_URL and CEREBRIUM_API_KEY must be set in the environment variables');
}

const headers = {
  Authorization: `Bearer ${CEREBRIUM_API_KEY}`,
  'Content-Type': 'application/json'
};
export const generateTTS = async (text, gender, filePath) => {

  const payload = {
    text,
    voice: (gender === 'male' ? 'am_adam' : 'af_bella'),
    sample_rate: 24000,
    lang_code: 'a',
    speed: 0.8
  };

  try {
    console.log(`🔊 Generating audio`);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const { result } = await res.json();
    const audioBuffer = Buffer.from(result, 'base64');

    const folderPath = path.dirname(filePath);
    const fileName = path.basename(filePath);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, audioBuffer);

    console.log(`✅ Audio saved at: ${filePath}`);
  } catch (err) {
    console.error('❌ Error generating speech:', err);
  }
};


//For testing and reference purpose

// const text = `Hey there, future botanists! Ever wondered how plants eat? They don't go to the grocery store, that's for sure! They make their own food through a super cool process called photosynthesis.

// Think of plants as tiny chefs. They use sunlight as their energy source, like a solar-powered oven. They also need carbon dioxide, which is a gas we breathe out, and water, which they soak up through their roots.

// So, the plants take sunlight, carbon dioxide, and water, and mix them all together. What do they make? They create glucose, which is a type of sugar that's their food, and oxygen, which is what we breathe! It's like a magical recipe.

// Photosynthesis is essential for life on Earth. Plants provide us with the oxygen we need to breathe and the food we eat. Pretty amazing, right? So next time you see a plant, remember it's busy making its own food and helping us too!
// `;
// const filePath = './generated_audio/mahira_audio.wav';

// generateTTS(text, 'male', filePath);