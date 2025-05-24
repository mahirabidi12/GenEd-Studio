import express from 'express'
import multer from 'multer';
import { login, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// router.post("/signup" , signup)

router.post(
  '/signup',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  signup
);

router.post("/login" , login)

router.get("/userDetails", protect , (req,res) => {
    res.status(200).send(req.user);
})




export default router