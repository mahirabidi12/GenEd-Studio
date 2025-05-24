import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

export async function protect(req, res, next) {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized", error: error });
    }
  } else {
    res.status(401).json({ message: "No token , authorization denied" });
  }
}


