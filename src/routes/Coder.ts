import express from 'express';
import {
  registerCoder,
  getCoders,
  updateCoder,
  deleteCoder,
} from '../controllers/coderController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createCodeSchema } from '../dto/create-coderschema.js';

const router = express.Router();

router.post('/register', validateRequest(createCodeSchema), registerCoder);

router.get('/', getCoders);

router.put('/:id', updateCoder);

router.delete('/:id', deleteCoder);

export default router;
