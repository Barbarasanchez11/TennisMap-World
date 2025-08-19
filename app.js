import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import playerRoutes from './routes/playerRoutes.js';
import tournamentsRoutes from './routes/tournamentsRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TennisMap World API está en funcionamiento');
});


app.use('/players', playerRoutes);
app.use('/tournament', tournamentsRoutes);
app.use('/weather', weatherRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
