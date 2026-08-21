import express from 'express';
import {
  registerClan,
  getClans,
  updateClan,
  deleteClan,
} from '../controllers/clanController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createClanSchema } from '../dto/create-clanschema.js';

const router = express.Router();

router.post('/register', validateRequest(createClanSchema), registerClan);

router.get('/', getClans);

router.put('/:id', updateClan);

router.delete('/:id', deleteClan);

export default router;
