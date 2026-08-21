import express from 'express';
import {
  registerCity,
  getCities,
  updateCity,
  deleteCity,
} from '../controllers/cityController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createCitySchema } from '../dto/create-cityschema.js';

const router = express.Router();

router.post('/register', validateRequest(createCitySchema), registerCity);

router.get('/', getCities);

router.put('/:id', updateCity);

router.delete('/:id', deleteCity);

export default router;
