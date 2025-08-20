import express from 'express';
import tournamentControllers from '../controllers/tournamentsControllers.js';
const router= express.Router()
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

router.get('/', tournamentControllers.getTournament);
router.post('/', authenticateToken, requireAdmin, tournamentControllers.createTournament);
router.get('/:id', tournamentControllers.getTournamentById);
router.put('/:id', authenticateToken, requireAdmin, tournamentControllers.updateTournament);
router.delete('/:id', authenticateToken, requireAdmin, tournamentControllers.deleteTournament);


export default router