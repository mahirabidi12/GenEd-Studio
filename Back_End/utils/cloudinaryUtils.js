import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

/**
 * Uploads a video file to Cloudinary
 * @param {string} filePath - Path to the video file
 * @param {string} folder - Folder in Cloudinary where the file should be stored
 * @returns {Promise<string>} - URL of the uploaded video
 */
export const uploadVideoToCloudinary = async (filePath, folder = 'videos') => {
    try {
        // Ensure the file exists before uploading
        await fs.access(filePath);
        
        // Upload the video to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video',
            folder: folder,
            chunk_size: 6000000, // 6MB chunks for better reliability with large files
            eager: [
                { width: 1280, height: 720, crop: 'scale' },
                { width: 854, height: 480, crop: 'scale' }
            ],
            eager_async: true
        });
        
        console.log('Video uploaded to Cloudinary:', result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        throw new Error(`Failed to upload video: ${error.message}`);
    }
};

/**
 * Deletes a file from the local filesystem
 * @param {string} filePath - Path to the file to delete
 */
export const deleteLocalFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log('Deleted local file:', filePath);
    } catch (error) {
        console.error('Error deleting local file:', error);
        // Don't throw error for failed deletes to not interrupt the main flow
    }
};
