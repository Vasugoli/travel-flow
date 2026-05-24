import { Router } from 'express';
import authController from '@/controllers/authController';
import protect from '@/middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect as any, authController.getMe);

export default router;
