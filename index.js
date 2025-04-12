import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {initDB} from "./config/db.js";
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin:'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/bizivility/users', userRoutes);

const PORT = process.env.PORT || 5500;

const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();