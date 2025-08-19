import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tournament from '../models/Tournament.js';

dotenv.config();

const testTournamentModel = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tennismap');
 

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
   

    const found = await Tournament.findOne({ name: 'Roland Garros 2024' });
 

    await Tournament.deleteOne({ name: 'Roland Garros 2024' });
   

    
    
  } catch (error) {
    console.error(' Error:', error.message);
  } finally {
    await mongoose.connection.close();
   
  }
};

testTournamentModel(); 