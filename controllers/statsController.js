import statsService from '../services/statsService.js';

const getTournamentStats = async (_req, res) => {
    try {
        const stats = await statsService.getTournamentStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting tournament stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tournament statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getPlayerStats = async (_req, res) => {
    try {
        const stats = await statsService.getPlayerStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting player stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching player statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getCombinedStats = async (_req, res) => {
    try {
        const stats = await statsService.getCombinedStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting combined stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching combined statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getGeographicStats = async (_req, res) => {
    try {
        const stats = await statsService.getGeographicStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting geographic stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching geographic statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

const getWeatherStats = async (_req, res) => {
    try {
        const stats = await statsService.getWeatherStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error getting weather stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching weather statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        });
    }
};

export {
    getTournamentStats,
    getPlayerStats,
    getCombinedStats,
    getGeographicStats,
    getWeatherStats
}; 