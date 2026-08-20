import express, { type Request, type Response } from 'express';
import 'dotenv/config';
import db from './config/db.js';
import routerCoder from './routes/Coder.js';

const { PORT } = process.env;

const app = express();

app.use(express.json());

app.use('/coder', routerCoder);

start();

async function start() {
  try {
    await db.authenticate();
    await db.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
