import express from 'express';

import {
  registerRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';

import { validateRequest } from '../middlewares/validateRequests.js';
import { createRoomSchema } from '../dto/create-roomschema.js';

const router = express.Router();

router.post('/register', validateRequest(createRoomSchema), registerRoom);

router.get('/', getRooms);

router.get('/:id', getRoomById);

router.put('/:id', updateRoom);

router.delete('/:id', deleteRoom);

export default router;
