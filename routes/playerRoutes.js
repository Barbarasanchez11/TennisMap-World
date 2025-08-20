import express from 'express';
import { getAllPlayers,getPlayerById,createPlayer,updatePlayer,deletePlayer,getPlayersByLocation,getPlayersByRanking} from '../controllers/playersController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/', getAllPlayers);
router.get('/nearby/location', getPlayersByLocation);
router.get('/ranking/filter', getPlayersByRanking);
router.get('/:id', getPlayerById);
router.post('/', authenticateToken, requireAdmin, createPlayer);
router.put('/:id', authenticateToken, requireAdmin, updatePlayer);
router.delete('/:id', authenticateToken, requireAdmin, deletePlayer);

export default router; 