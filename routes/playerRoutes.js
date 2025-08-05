import express from 'express';
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayersByLocation,
  getPlayersByRanking
} from '../controllers/playersController.js';

const router = express.Router();


router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

router.get('/nearby/location', getPlayersByLocation);
router.get('/ranking/filter', getPlayersByRanking);

export default router; 