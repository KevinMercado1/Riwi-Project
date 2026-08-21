import express, { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import TeamLeader from '../models/teamLeader.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createTeamLeaderSchema } from '../dto/create-tlschema.js';

import { loginSchema } from '../dto/login-schema.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createTeamLeaderSchema),
  async (req: Request, res: Response) => {
    const { name, surname, numer_telefonu, email, password, rol } = req.body;
  }
);

export default router;
