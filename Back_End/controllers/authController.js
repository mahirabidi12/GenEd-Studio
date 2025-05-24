import User from "../models/userModel.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs/promises';


export async function signup(req, res) {
  let videoCount = 1;
  try {
    console.log(req.body)
    const { name, email, password, videoName } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json("User Already Exists");
    }

    const files = req.files;

    if (!files || (!files.video)) {
      return res.status(400).json("Please upload at least a video");
    }

    const videoUrls = [];

    async function uploadAndCleanup(file, typeName) {

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        public_id: typeName,
        overwrite: true,
      });

      // Delete local temp file
      await fs.unlink(file.path);

      return result.secure_url;
    }

    //video
    if (files.video) {
      if (Array.isArray(files.video)) {
        for (const videoFile of files.video) {
          const publicName = videoName || `video${videoCount++}`;
          const url = await uploadAndCleanup(videoFile, publicName);
          videoUrls.push({ name: publicName, url });
        }
      } else {
        const publicName = videoName || `video${videoCount++}`;
        const url = await uploadAndCleanup(files.video, publicName);
        videoUrls.push({ name: publicName, url });
      }
    }

    const newUser = await User.create({
      name,
      email,
      password,
      videoUrls,
    });
    console.log("Created User:", newUser);

    return res.status(201).json("User created Successfully , Please login");
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User Does Not Exist");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json("Invalid Credentials");
    }

    const token = await generateToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        videoUrls: user.videoUrls,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
