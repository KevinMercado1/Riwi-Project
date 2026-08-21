import express from 'express';
import {
  registerRouteRiwi,
  getRoutesRiwi,
  updateRouteRiwi,
  deleteRouteRiwi,
} from '../controllers/routeRiwiController.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createRouteRiwiSchema } from '../dto/create-routeriwischema.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createRouteRiwiSchema),
  registerRouteRiwi
);

router.get('/', getRoutesRiwi);

router.put('/:id', updateRouteRiwi);

router.delete('/:id', deleteRouteRiwi);

export default router;
