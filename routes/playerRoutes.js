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

// Rutas básicas CRUD
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

// Rutas especializadas
router.get('/nearby/location', getPlayersByLocation);
router.get('/ranking/filter', getPlayersByRanking);

export default router; 