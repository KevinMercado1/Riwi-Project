import type { Request, Response } from 'express';
import RouteRiwi from '../models/routeRiwi.js';

export const registerRouteRiwi = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const routeRiwi = await RouteRiwi.create({
      name,
    });

    res.status(201).json({
      message: 'Riwi route created successfully',
      routeRiwi,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating Riwi route',
      error,
    });
  }
};

export const getRoutesRiwi = async (req: Request, res: Response) => {
  try {
    const routesRiwi = await RouteRiwi.findAll();

    res.status(200).json(routesRiwi);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching Riwi routes',
      error,
    });
  }
};

export const updateRouteRiwi = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const routeRiwi = await RouteRiwi.findByPk(id);

    if (!routeRiwi) {
      return res.status(404).json({
        message: 'Riwi route not found',
      });
    }

    await routeRiwi.update({
      name,
    });

    res.status(200).json({
      message: 'Riwi route updated successfully',
      routeRiwi,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating Riwi route',
      error,
    });
  }
};

export const deleteRouteRiwi = async (
  req: Request<{ id: string }>,
  res: Response
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

    res.status(200).json({
      message: 'Riwi route deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting Riwi route',
      error,
    });
  }
};
