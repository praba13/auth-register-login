import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';

import connectDB from './database/connection.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT} SUCESSFULLY !!!`.magenta.bold);
  connectDB();
});
