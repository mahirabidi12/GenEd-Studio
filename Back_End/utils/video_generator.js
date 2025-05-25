import axios from "axios";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

async function generateVideos(promptArray, outputDir) {
    // Step 1: Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Step 2: Send prompts to generate API
    const prompts = promptArray.map(p => p.prompt);
    const idMap = Object.fromEntries(promptArray.map(p => [p.prompt, p.id]));

    const { data: generationResponse } = await axios.post(
        `${process.env.VIDEO_GEN_API_URL}/generate`,
        { prompts }
    );

    const tasks = generationResponse.tasks;
    const results = [];

    // Step 3: Polling each task
    const pollTask = async (task) => {
        const statusUrl = `${process.env.VIDEO_GEN_API_URL}/status/${task.task_id}`;

        while (true) {
            try {
                const { data: statusResponse } = await axios.get(statusUrl);
                if (statusResponse.status === 'done' && statusResponse.results && statusResponse.results.length > 0) {
                    const result = statusResponse.results[0];
                    const videoUrl = result.video_url;
                    const videoPath = path.join(outputDir, `${task.task_id}.mp4`);

                    const writer = fs.createWriteStream(videoPath);
                    const videoStream = await axios.get(videoUrl, { responseType: 'stream' });
                    videoStream.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    results.push({ id: idMap[result.prompt], path: videoPath });
                    console.log(`Downloaded video for task ${task.task_id}`);
                    break;
                } else {
                    console.log(`Task ${task.task_id} still processing...`);
                }
            } catch (err) {
                console.error(`Error polling task ${task.task_id}:`, err.message);
            }

            // Wait 1 minute before next poll
            await new Promise(res => setTimeout(res, 60_000));
        }
    };

    await Promise.all(tasks.map(pollTask));

    return results;
}


export default generateVideos;

// Example usage:
// const prompts = [
//     { id: 1, prompt: "A beautiful sunset over the mountains" },
//     { id: 2, prompt: "A bustling city street at night" },
//     { id: 3, prompt: "A serene beach with gentle waves" },
//     { id: 4, prompt: "A peaceful forest with sunlight filtering through the trees" }
// ];
// const outputDir = './videos';
// generateVideos(prompts, outputDir)
//     .then(results => console.log('Video generation completed:', results))