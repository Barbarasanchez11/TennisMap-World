import express from 'express';
import tournamentControllers from '../controllers/tournamentsControllers';
const router= express.Router()

router.get('/', tournamentControllers.getTournament);
router.post('/', tournamentControllers.createTournament)
router.get('/:id', tournamentControllers.getTournamentById);
router.put('/:id', tournamentControllers.updateTournament)
router.delete('/:id', tournamentControllers.deleteTournament)


export default router