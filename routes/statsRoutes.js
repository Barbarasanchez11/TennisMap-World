import express from 'express';
import {
    getTournamentStats,
    getPlayerStats,
    getCombinedStats,
    getGeographicStats,
    getWeatherStats
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/tournaments', getTournamentStats);
router.get('/players', getPlayerStats);
router.get('/combined', getCombinedStats);
router.get('/geographic', getGeographicStats);
router.get('/weather', getWeatherStats);

export default router; 