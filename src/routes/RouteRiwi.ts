import express from 'express';

import {
  registerRouteRiwi,
  getRoutesRiwi,
  getRouteRiwiById,
  updateRouteRiwi,
  deleteRouteRiwi,
} from '../controllers/routeRiwiController.js';

const router = express.Router();

router.post('/', registerRouteRiwi);

router.get('/', getRoutesRiwi);

router.get('/:id', getRouteRiwiById);

router.put('/:id', updateRouteRiwi);

router.delete('/:id', deleteRouteRiwi);

export default router;
