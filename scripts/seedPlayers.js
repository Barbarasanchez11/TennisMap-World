import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

import Player from '../models/Player.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tennismap');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadPlayersData = () => {
  try {
    const dataPath = path.join(__dirname, '../data/players.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error leyendo archivo de datos:', error.message);
    process.exit(1);
  }
};

const clearPlayers = async () => {
  try {
    await Player.deleteMany({});
    console.log('Colección de jugadores limpiada');
  } catch (error) {
    console.error('Error limpiando jugadores:', error.message);
  }
};

const seedPlayers = async () => {
  try {
    const playersData = loadPlayersData();
    
    await clearPlayers();
    
    const players = await Player.insertMany(playersData);
    
    console.log(`${players.length} jugadores insertados exitosamente`);
    
    players.forEach(player => {
      console.log(`${player.fullName} - Ranking: ${player.ranking} - País: ${player.country}`);
    });
    
  } catch (error) {
    console.error('Error insertando jugadores:', error.message);
  }
};

const main = async () => {
  console.log('Iniciando seed de jugadores...');
  
  await connectDB();
  
  await seedPlayers();
  
  console.log('Seed completado exitosamente');
  
  mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada');
};

if (require.main === module) {
  main().catch(error => {
    console.error('Error en el script de seed:', error);
    process.exit(1);
  });
}

export { seedPlayers, connectDB }; 