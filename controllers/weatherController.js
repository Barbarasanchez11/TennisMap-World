import weatherService from '../services/weatherService.js';
import mongoose from 'mongoose';
import Tournament from '../models/Tournament.js';

const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        
        if (isNaN(latNum) || isNaN(lngNum)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude format'
            });
        }

    

        const weather = await weatherService.getCurrentWeather(latNum, lngNum);
        
        res.status(200).json({
            success: true,
            data: weather
        });
        
    } catch (error) {
        console.error('Error in getCurrentWeather:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching current weather',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getWeatherForecast = async (req, res) => {
    try {
        const { lat, lng, days = 7 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const daysNum = parseInt(days);
        
        if (isNaN(latNum) || isNaN(lngNum)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude format'
            });
        }

        if (isNaN(daysNum) || daysNum < 1 || daysNum > 16) {
            return res.status(400).json({
                success: false,
                message: 'Days must be a number between 1 and 16'
            });
        }

        const forecast = await weatherService.getWeatherForecast(latNum, lngNum, daysNum);
        
        res.status(200).json({
            success: true,
            data: forecast
        });
        
    } catch (error) {
        console.error('Error in getWeatherForecast:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather forecast',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getWeatherForTournament = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tournament ID format'
            });
        }

        const tournament = await Tournament.findById(id);
        
        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        const { lat, lng } = tournament.location;
        const currentWeather = await weatherService.getCurrentWeather(lat, lng);
        const forecast = await weatherService.getWeatherForecast(lat, lng, 7);
        
        res.status(200).json({
            success: true,
            data: {
                tournament: {
                    id: tournament._id,
                    name: tournament.name,
                    location: tournament.location
                },
                currentWeather,
                forecast
            }
        });
        
    } catch (error) {
        console.error('Error in getWeatherForTournament:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather for tournament',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getCacheStats = async (req, res) => {
    try {
        const stats = weatherService.getCacheStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error in getCacheStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cache stats',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const clearCache = async (req, res) => {
    try {
        weatherService.clearCache();
        
        res.status(200).json({
            success: true,
            message: 'Cache cleared successfully'
        });
        
    } catch (error) {
        console.error('Error in clearCache:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cache',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

export {
    getCurrentWeather,
    getWeatherForecast,
    getWeatherForTournament,
    getCacheStats,
    clearCache
}; 