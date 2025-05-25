import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { generateTranscript, genFinalPrompt } from '../controllers/transControler.js';

const router = express.Router();

router.post("/genTranscript",protect,generateTranscript)
router.post("/genFinalPrompt" ,protect, genFinalPrompt)

// router.post("/")

export default router  