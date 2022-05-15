import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './database/connection.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

dotenv.config();

//Middleware
app.use(morgan('common'));
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT} SUCESSFULLY !!!`.magenta.bold);
  connectDB();
});
