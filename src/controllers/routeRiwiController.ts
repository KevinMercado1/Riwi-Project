import type { Request, Response } from 'express';

import RouteRiwi from '../models/routeRiwi.js';
import Coder from '../models/coder.js';
import TeamLeader from '../models/teamLeader.js';

export const registerRouteRiwi = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Route name is required',
      });
    }

    const routeRiwi = await RouteRiwi.create({
      name,
    });

    return res.status(201).json({
      message: 'Riwi route created successfully',
      routeRiwi,
    });
  } catch (error) {
    console.error('Error creating Riwi route:', error);

    return res.status(500).json({
      message: 'Error creating Riwi route',
    });
  }
};

export const getRoutesRiwi = async (req: Request, res: Response) => {
  try {
    const routesRiwi = await RouteRiwi.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(routesRiwi);
  } catch (error) {
    console.error('Error fetching Riwi routes:', error);

    return res.status(500).json({
      message: 'Error fetching Riwi routes',
    });
  }
};

export const getRouteRiwiById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const routeRiwi = await RouteRiwi.findByPk(id, {
      attributes: ['id', 'name'],

      include: [
        {
          model: Coder,
          as: 'coders',
          attributes: [
            'id',
            'name',
            'surname',
            'email',
            'clanId',
            'routeRiwiId',
            'roomId',
          ],
        },
        {
          model: TeamLeader,
          as: 'teamLeader',
          attributes: [
            'id',
            'name',
            'surname',
            'email',
            'clanId',
            'routeRiwiId',
            'roomId',
          ],
        },
      ],
    });

    if (!routeRiwi) {
      return res.status(404).json({
        message: 'Riwi route not found',
      });
    }

    return res.status(200).json({
      message: 'Riwi route found successfully',
      routeRiwi,
    });
  } catch (error) {
    console.error('Error getting Riwi route:', error);

    return res.status(500).json({
      message: 'Error getting Riwi route',
    });
  }
};

export const updateRouteRiwi = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Route name is required',
      });
    }

    const routeRiwi = await RouteRiwi.findByPk(id);

    if (!routeRiwi) {
      return res.status(404).json({
        message: 'Riwi route not found',
      });
    }

    await routeRiwi.update({
      name,
    });

    return res.status(200).json({
      message: 'Riwi route updated successfully',
      routeRiwi,
    });
  } catch (error) {
    console.error('Error updating Riwi route:', error);

    return res.status(500).json({
      message: 'Error updating Riwi route',
    });
  }
};

export const deleteRouteRiwi = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const routeRiwi = await RouteRiwi.findByPk(id);

    if (!routeRiwi) {
      return res.status(404).json({
        message: 'Riwi route not found',
      });
    }

    await routeRiwi.destroy();

    return res.status(200).json({
      message: 'Riwi route deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Riwi route:', error);

    return res.status(500).json({
      message: 'Error deleting Riwi route',
    });
  }
};
