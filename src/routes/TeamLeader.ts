import express from 'express';
import {
  registerTeamLeader,
  getTeamLeaders,
  updateTeamLeader,
  deleteTeamLeader,
} from '../controllers/teamLeaderController.js';

import { validateRequest } from '../middlewares/validateRequests.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createTeamLeaderSchema } from '../dto/create-tlschema.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createTeamLeaderSchema),
  registerTeamLeader
);

router.get('/', authMiddleware, getTeamLeaders);

router.put('/:id', authMiddleware, updateTeamLeader);

router.delete('/:id', authMiddleware, deleteTeamLeader);

export default router;
