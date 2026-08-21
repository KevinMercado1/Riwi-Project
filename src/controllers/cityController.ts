import type { Request, Response } from 'express';
import City from '../models/city.js';

export const registerCity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const city = await City.create({ name });

    res.status(201).json({
      message: 'City created successfully',
      city,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating city',
      error,
    });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.findAll();

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching cities',
      error,
    });
  }
};

export const updateCity = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        message: 'City not found',
      });
    }

    await city.update({ name });

    res.status(200).json({
      message: 'City updated successfully',
      city,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating city',
      error,
    });
  }
};

export const deleteCity = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({
        message: 'City not found',
      });
    }

    await city.destroy();

    res.status(200).json({
      message: 'City deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting city',
      error,
    });
  }
};
