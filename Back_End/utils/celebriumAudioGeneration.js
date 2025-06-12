import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'

dotenv.config();

const API_URL = process.env.CEREBRIUM_API_URL

const headers = {
  Authorization: `Bearer ${process.env.CEREBRIUM_API_KEY}`,
  'Content-Type': 'application/json'
};
export const generateTTS = async (text, folderPath, fileName) => {
  const payload = {
    text,
    voice: 'af_bella',
    sample_rate: 24000,
    lang_code: 'a',
    speed: 0.9
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const { result } = await res.json();
    const audioBuffer = Buffer.from(result, 'base64');


    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, audioBuffer);

    console.log(`✅ Audio saved at: ${filePath}`);
  } catch (err) {
    console.error('❌ Error generating speech:', err.message);
  }
};


//For testing and reference purpose

// const text = 'Hello Mahir, this audio was generated and saved using a custom path!';
// const folder = './generated_audio';
// const file = 'mahir_audio.wav';

// generateTTS(text, folder, file);