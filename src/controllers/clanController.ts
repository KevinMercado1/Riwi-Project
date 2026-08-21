import type { Request, Response } from 'express';
import Clan from '../models/clan.js';

export const registerClan = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const clan = await Clan.create({
      name,
    });

    res.status(201).json({
      message: 'Clan created successfully',
      clan,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating clan',
      error,
    });
  }
};

export const getClans = async (req: Request, res: Response) => {
  try {
    const clans = await Clan.findAll();

    res.status(200).json(clans);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching clans',
      error,
    });
  }
};

export const updateClan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const clan = await Clan.findByPk(id);

    if (!clan) {
      return res.status(404).json({
        message: 'Clan not found',
      });
    }

    await clan.update({
      name,
    });

    res.status(200).json({
      message: 'Clan updated successfully',
      clan,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating clan',
      error,
    });
  }
};

export const deleteClan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const clan = await Clan.findByPk(id);

    if (!clan) {
      return res.status(404).json({
        message: 'Clan not found',
      });
    }

    await clan.destroy();

    res.status(200).json({
      message: 'Clan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting clan',
    });
  }
};
