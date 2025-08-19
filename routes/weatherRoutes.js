import express from 'express';
import {
    getCurrentWeather,
    getWeatherForecast,
    getWeatherForTournament,
    getCacheStats,
    clearCache
} from '../controllers/weatherController.js';

const router = express.Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/tournament/:id', getWeatherForTournament);
router.get('/cache/stats', getCacheStats);
router.delete('/cache', clearCache);

export default router; 