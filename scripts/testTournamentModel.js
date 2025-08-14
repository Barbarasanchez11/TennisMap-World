import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tournament from '../models/Tournament.js';

dotenv.config();

const testTournamentModel = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tennismap');
    console.log('✅ MongoDB conectado');

    const testTournament = new Tournament({
      name: 'Roland Garros 2024',
      startDate: new Date('2024-05-26'),
      endDate: new Date('2024-06-09'),
      location: {
        lat: 48.8467,
        lng: 2.2474
      },
      surface: 'clay',
      category: 'Grand Slam',
      country: 'France',
      city: 'Paris'
    });

    await testTournament.save();
    console.log('✅ Tournament creado:', testTournament.name);

    const found = await Tournament.findOne({ name: 'Roland Garros 2024' });
    console.log('✅ Tournament encontrado:', found.name);

    await Tournament.deleteOne({ name: 'Roland Garros 2024' });
    console.log('✅ Tournament eliminado');

    console.log('🎾 Modelo Tournament funciona perfectamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

testTournamentModel(); 