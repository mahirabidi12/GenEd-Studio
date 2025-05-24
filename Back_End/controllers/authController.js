import User from "../models/userModel.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { name, email, password, videoUrls, audioUrls } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json("User Already Exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      videoUrls,
      audioUrls,
    });
    return res.status(201).json("User created Successfully , Please login");
  } catch (error) {
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
      },
    });
  } catch (error) {
    return res.status(500).json({error : error.message})
  }
}
