import express from 'express';
import {
  registerIdentification,
  getIdentifications,
  updateIdentification,
  deleteIdentification,
} from '../controllers/identificationController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createIdentificationSchema } from '../dto/create-identificationschema.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createIdentificationSchema),
  registerIdentification
);

router.get('/', getIdentifications);

router.put('/:id', updateIdentification);

router.delete('/:id', deleteIdentification);

export default router;
