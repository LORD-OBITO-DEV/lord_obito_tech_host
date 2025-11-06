import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import paypalRoutes from './routes/paypalRoutes.js';
import panelRoutes from './routes/panelRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MONGO = process.env.MONGO_URI;
if(!MONGO) console.warn('MONGO_URI not set in .env');

mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error', err));

app.use('/api/paypal', paypalRoutes);
app.use('/api/panels', panelRoutes);

// simple health
app.get('/', (req,res) => res.send('LORD OBITO TECH HOST API'));

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
