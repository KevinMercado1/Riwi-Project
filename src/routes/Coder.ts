import express from 'express';

import {
  registerCoder,
  getCoders,
  updateCoder,
  deleteCoder,
} from '../controllers/coderController.js';

import {
  authMiddleware,
  type AuthRequest,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', registerCoder);

router.get('/', authMiddleware, getCoders);

router.put('/:id', authMiddleware, updateCoder);

router.delete('/:id', authMiddleware, deleteCoder);

export default router;
