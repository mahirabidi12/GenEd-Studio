import jwt, { decode } from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/userModel.js";

dotenv.config();



export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach the user to the request object
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};















// export async function protect(req, res, next) {
//   let token = req.headers.authorization;

//   if (token && token.startsWith("Bearer")) {
//     try {
//       const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Unauthorized", error: error });
//     }
//   } else {
//     res.status(401).json({ message: "No token , authorization denied" });
//   }
// }


