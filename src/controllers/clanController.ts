import type { Request, Response } from 'express';

import Clan from '../models/clan.js';
import Coder from '../models/coder.js';
import RouteRiwi from '../models/routeRiwi.js';
import TeamLeader from '../models/teamLeader.js';

export const registerClan = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Clan name is required',
      });
    }

    const clan = await Clan.create({
      name,
    });

    return res.status(201).json({
      message: 'Clan created successfully',
      clan,
    });
  } catch (error) {
    console.error('Error creating clan:', error);

    return res.status(500).json({
      message: 'Error creating clan',
    });
  }
};

export const getClans = async (req: Request, res: Response) => {
  try {
    const clans = await Clan.findAll();

    return res.status(200).json(clans);
  } catch (error) {
    console.error('Error fetching clans:', error);

    return res.status(500).json({
      message: 'Error fetching clans',
    });
  }
};

export const getClanById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const clan = await Clan.findByPk(id, {
      attributes: ['id', 'name'],

      include: [
        {
          model: Coder,
          attributes: ['id', 'name', 'surname', 'email', 'clanId'],
        },
        {
          model: TeamLeader,
          attributes: ['id', 'name', 'surname', 'email', 'clanId'],
        },
      ],
    });

    if (!clan) {
      return res.status(404).json({
        message: 'Clan not found',
      });
    }

    return res.status(200).json({
      message: 'Clan found successfully',
      clan,
    });
  } catch (error) {
    console.error('Error getting clan:', error);

    return res.status(500).json({
      message: 'Error getting clan',
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

    if (!name) {
      return res.status(400).json({
        message: 'Clan name is required',
      });
    }

    const clan = await Clan.findByPk(id);

    if (!clan) {
      return res.status(404).json({
        message: 'Clan not found',
      });
    }

    await clan.update({
      name,
    });

    return res.status(200).json({
      message: 'Clan updated successfully',
      clan,
    });
  } catch (error) {
    console.error('Error updating clan:', error);

    return res.status(500).json({
      message: 'Error updating clan',
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

    return res.status(200).json({
      message: 'Clan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting clan:', error);

    return res.status(500).json({
      message: 'Error deleting clan',
    });
  }
};
