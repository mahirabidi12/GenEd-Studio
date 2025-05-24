import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { generateTranscript } from '../controllers/transControler.js';

const router = express.Router();

router.post("/genTranscript",generateTranscript)

// router.post("/")

export default router   