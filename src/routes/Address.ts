import express from 'express';
import {
  registerAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createAddressSchema } from '../dto/create-addressschema.js';

const router = express.Router();

router.post('/register', validateRequest(createAddressSchema), registerAddress);

router.get('/', getAddresses);

router.put('/:id', updateAddress);

router.delete('/:id', deleteAddress);

export default router;
