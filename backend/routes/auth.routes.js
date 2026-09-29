import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.js'
const router = Router();
router.get('/me', authenticateToken, me);
router.post('/register', register);
router.post('/login', login);

export default router;