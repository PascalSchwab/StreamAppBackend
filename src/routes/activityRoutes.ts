import { Router } from 'express';
import { restartActivity } from '../controllers/activityController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/replay', authMiddleware, restartActivity);

export default router;