import { Router } from 'express';
import { restartActivity } from '../controllers/activityController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';

const router = Router();

router.get('/replay', authMiddleware, restartActivity);

export default router;