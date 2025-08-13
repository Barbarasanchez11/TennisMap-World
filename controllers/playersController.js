import Player from '../models/Player.js';

const getAllPlayers = async (_req, res) => {
  try {
    const players = await Player.find({});

    res.status(200).json({
      success: true,
      data: players
    });
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving players',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const player = await Player.findById(id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Error getting player by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving player',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const createPlayer = async (req, res) => {
  try {
    const playerData = req.body;
    
    const player = new Player(playerData);
    await player.save();

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player
    });
  } catch (error) {
    console.error('Error creating player:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Please check your input data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid data provided'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating player: Invalid data provided',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const player = await Player.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Player updated successfully',
      data: player
    });
  } catch (error) {
    console.error('Error updating player:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Please check your update data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid data provided'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating player: Invalid data provided',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const player = await Player.findByIdAndDelete(id);
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting player',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const getPlayersByLocation = async (req, res) => {
  try {
   
    const { lat, lng } = req.query;
    const radius = req.query.radius || 1000;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const radiusNumber = parseInt(radius);
    if (radiusNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be a positive number'
      });
    }

   
    const players = await Player.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusNumber
        }
      }
    });

    res.status(200).json({
      success: true,
      data: players,
      count: players.length
    });
  } catch (error) {
    console.error('Error searching players by location:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching players by location',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

const getPlayersByRanking = async (req, res) => {
  try {
    const { min, max } = req.query;
    
    let query = {};
    if (min && max) {
      query.ranking = { $gte: parseInt(min), $lte: parseInt(max) };
    } else if (min) {
      query.ranking = { $gte: parseInt(min) };
    } else if (max) {
      query.ranking = { $lte: parseInt(max) };
    }

    const players = await Player.find(query).sort({ ranking: 1 });

    res.status(200).json({
      success: true,
      data: players,
      count: players.length
    });
  } catch (error) {
    console.error('Error getting players by ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting players by ranking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
};

export {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayersByLocation,
  getPlayersByRanking
};