import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { changeEmoteMode, changeFollowerMode, changeSlowMode, changeSubMode } from '../controllers/twitchController';

const router = Router();

router.get('/slowMode', authMiddleware, changeSlowMode);
router.get('/followMode', authMiddleware, changeFollowerMode);
router.get('/subMode', authMiddleware, changeSubMode);
router.get('/emoteMode', authMiddleware, changeEmoteMode);

export default router;