import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_IMAGE_GENERATION);

async function generateImages(prompts, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-preview-image-generation',
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const results = [];
    for (const { id, prompt } of prompts) {
        console.log(`Processing prompt ID ${id}`);
        try {
            const response = await model.generateContent(prompt);
            const parts = response.response.candidates[0].content.parts;

            const imagePart = parts.find(part => part.inlineData && part.inlineData.data);
            if (!imagePart) {
                console.warn(`No image generated for prompt ID ${id}`);
                continue;
            }

            const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(768, 512)
                .toBuffer();

            const imagePath = path.join(outputDir, `image_${id}.png`);

            await fs.writeFile(imagePath, resizedImageBuffer);

            results.push({ id, path: imagePath });
        } catch (error) {
            console.error(`Error processing prompt ID ${id}:`, error);
        }
    }

    return results;
}


export default generateImages;



// Example usage:
// const prompts = [
//     { id: 1, prompt: 'A serene landscape with mountains during sunset' },
//     { id: 2, prompt: 'A futuristic city skyline at night' },
// ];

// generateImages(prompts, './output')
//     .then(results => {
//         console.log('Generated Images:', results);
//     })
//     .catch(error => {
//         console.error('Error generating images:', error);
//     });