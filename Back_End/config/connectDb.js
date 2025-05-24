import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

export default async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDb`)
    } catch (error) {
        console.error(`Failed To Connect To MongoDb` ,error);
    }
}