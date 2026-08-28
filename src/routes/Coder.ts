import express from 'express';

import {
  registerCoder,
  getCoders,
  updateCoder,
  deleteCoder,
} from '../controllers/coderController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createCodeSchema } from '../dto/create-coderschema.js';

const router = express.Router();

router.post('/register', validateRequest(createCodeSchema), registerCoder);

router.get('/', authMiddleware, getCoders);

router.put('/:id', authMiddleware, updateCoder);

router.delete('/:id', authMiddleware, deleteCoder);

export default router;
