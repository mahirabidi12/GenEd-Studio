import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import * as mkdirpModule from 'mkdirp';
import say from 'say';

// Get the mkdirp function from the module
const mkdirp = mkdirpModule.mkdirp || mkdirpModule.default || mkdirpModule;

// Convert say.export to a Promise-based function
const exportSpeech = promisify((text, voice, speed, filename, callback) => {
    say.export(text, voice, speed, filename, callback);
});

async function convertLinesToAudio(lines, outputDir = 'output') {
    // Create output directory if it doesn't exist
    await mkdirp(outputDir);

    // Process each line
    const results = await Promise.all(
        lines.map(async ({ id, line }) => {
            try {
                // Generate a filename based on the ID
                const filename = `${id}.wav`;
                const outputPath = path.join(outputDir, filename);

                // Export speech to file (null voice uses system default, 1.0 is normal speed)
                await exportSpeech(line, null, 1.0, outputPath);

                return {
                    id,
                    path: outputPath
                };
            } catch (error) {
                console.error(`Error processing line with ID ${id}:`, error);
                return {
                    id,
                    path: null,
                    error: error.message
                };
            }
        })
    );

    return results;
}

export default convertLinesToAudio;

// Example usage:
// const lines = [
//     { id: 1, line: 'Hello, this is a test.' },
//     { id: 2, line: 'This is another line to convert.' }
// ];
// convertLinesToAudio(lines, './audio_output')