import express from 'express';
import {
  registerRole,
  getRoles,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createRoleSchema } from '../dto/create-roleschema.js';

const router = express.Router();

router.post('/register', validateRequest(createRoleSchema), registerRole);

router.get('/', getRoles);

router.put('/:id', updateRole);

router.delete('/:id', deleteRole);

export default router;
