import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { getMe, setUserRole } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.post('/roles/:uid', authenticateToken, requireAdmin, setUserRole);

export default router;


