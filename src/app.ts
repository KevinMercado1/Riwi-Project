import express from 'express';
import 'dotenv/config';
import db from './config/db.js';
import routerCoder from './routes/Coder.js';
import routerTeamLeader from './routes/TeamLeader.js';
import authRoute from './routes/authRoutes.js';
import routeCity from './routes/City.js';
import './models/associations.js';
import routeAddress from './routes/Address.js';
import routeIdentification from './routes/identification.js';
import routeRole from './routes/role.js';
import routeClan from './routes/Clan.js';
import routeRouteRiwi from './routes/RouteRiwi.js';
const { PORT } = process.env;

const app = express();

app.use(express.json());

app.use('/coder', routerCoder);
app.use('/teamleader', routerTeamLeader);
app.use('/auth', authRoute);
app.use('/city', routeCity);
app.use('/address', routeAddress);
app.use('/identification', routeIdentification);
app.use('/role', routeRole);
app.use('/clan', routeClan);
app.use('/routeriwi', routeRouteRiwi);
start();

async function start() {
  try {
    await db.authenticate();
    

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
