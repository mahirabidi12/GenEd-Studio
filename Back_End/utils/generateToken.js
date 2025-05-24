import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export function generateToken(id) {
  const token = jwt.sign({id}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  return token;
}