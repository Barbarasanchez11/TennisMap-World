import Tournament from "../models/Tournament.js";
import mongoose from "mongoose";

const TournamentControllers = {
    getTournament: async (req,res) => {
        try {
            const { page = 1, limit = 10, category, surface, country } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            let query = {};
            
            if (category) query.category = category;
            if (surface) query.surface = surface;
            if (country) query.country = country;
            
            const tournaments = await Tournament.find(query)
                .limit(parseInt(limit))
                .skip(skip)
                .sort({ startDate: 1 });
                
            const total = await Tournament.countDocuments(query);
            
            res.status(200).json({
                success: true,
                data: tournaments,
                count: tournaments.length,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit))
            });
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching tournaments',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
        }
    },
    getTournamentById: async(req,res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tournament ID format'
                });
            }
            const tournament = await Tournament.findById(req.params.id)
            if (!tournament) return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
            res.status(200).json({
                success: true,
                data: tournament
            });    
        } catch (error) {
            console.error('Error getting tournament by ID:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error while retrieving tournament',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
        }
    },
    createTournament: async(req,res) => {
        const { name, startDate, endDate, location, description, surface, category,prizeMoney, participants, country, city, imageUrl, externalId } = req.body;

        if (!name || !startDate || !endDate || !location || !location.lat || !location.lng) {
            return res.status(400).json({
              success: false,
              message: 'Missing required fields: name, startDate, endDate, and location with lat/lng are required'
            });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please use YYYY-MM-DD format'
            });
        }

        if (endDateObj <= startDateObj) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        try {
            const newTournament = new Tournament(req.body)
            await newTournament.save()
            res.status(201).json({
                success: true,
                message: 'Tournament created successfully',
                data: newTournament
            });
        } catch (error) {
            console.error('Error creating tournament:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating tournament',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
            
        }  
    },
    updateTournament: async (req,res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tournament ID format'
                });
            }
            const id = req.params.id;
            const body = req.body;
            const tournament = await Tournament.findByIdAndUpdate(id, body)
            if(!tournament){
                return res.status(404).json({
                    success: false,
                    message: 'Tournament not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Tournament updated successfully',
                data: tournament
            });
        } catch (error) {
            console.error('Error updating tournament:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating tournament',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
        }
    },
    deleteTournament: async (req,res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tournament ID format'
                });
            }
            const tournament = await Tournament.findByIdAndDelete(req.params.id)
            if(!tournament) return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
            res.status(200).json({
                success: true,
                message: 'Tournament deleted successfully',
                data: tournament
            });  
        } catch (error) {
            console.error('Error deleting tournament:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while deleting tournament',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
        }
    }

}

export default TournamentControllers;