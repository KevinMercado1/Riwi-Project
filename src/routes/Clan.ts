import express from 'express';

import {
  registerClan,
  getClans,
  getClanById,
  updateClan,
  deleteClan,
} from '../controllers/clanController.js';

const router = express.Router();

router.post('/', registerClan);

router.get('/', getClans);

router.get('/:id', getClanById);

router.put('/:id', updateClan);

router.delete('/:id', deleteClan);

export default router;
