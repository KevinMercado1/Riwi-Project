import type { Request, Response } from 'express';
import Identification from '../models/Identification.js';

export const registerIdentification = async (req: Request, res: Response) => {
  try {
    const { type, number } = req.body;

    const identification = await Identification.create({
      type,
      number,
    });

    res.status(201).json({
      message: 'Identification created successfully',
      identification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating identification',
      error,
    });
  }
};

export const getIdentifications = async (req: Request, res: Response) => {
  try {
    const identifications = await Identification.findAll();

    res.status(200).json(identifications);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching identifications',
      error,
    });
  }
};

export const updateIdentification = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { type, number } = req.body;

    const identification = await Identification.findByPk(id);

    if (!identification) {
      return res.status(404).json({
        message: 'Identification not found',
      });
    }

    await identification.update({
      type,
      number,
    });

    res.status(200).json({
      message: 'Identification updated successfully',
      identification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating identification',
      error,
    });
  }
};

export const deleteIdentification = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const identification = await Identification.findByPk(id);

    if (!identification) {
      return res.status(404).json({
        message: 'Identification not found',
      });
    }

    await identification.destroy();

    res.status(200).json({
      message: 'Identification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting identification',
      error,
    });
  }
};
