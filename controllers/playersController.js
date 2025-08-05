import Player from '../models/Player.js';

const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find({});

    res.status(200).json({
      success: true,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo jugadores',
      error: error.message
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
        message: 'Jugador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo jugador',
      error: error.message
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
      message: 'Jugador creado exitosamente',
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creando jugador',
      error: error.message
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
        message: 'Jugador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Jugador actualizado exitosamente',
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error actualizando jugador',
      error: error.message
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
        message: 'Jugador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Jugador eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando jugador',
      error: error.message
    });
  }
};

const getPlayersByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    const players = await Player.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    res.status(200).json({
      success: true,
      data: players,
      count: players.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error buscando jugadores por ubicación',
      error: error.message
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
    res.status(500).json({
      success: false,
      message: 'Error obteniendo jugadores por ranking',
      error: error.message
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