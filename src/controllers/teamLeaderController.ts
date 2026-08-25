import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import TeamLeader from '../models/teamLeader.js';
import Role from '../models/role.js';
import Clan from '../models/clan.js';
import RouteRiwi from '../models/routeRiwi.js';
import Room from '../models/room.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

export const registerTeamLeader = async (req: Request, res: Response) => {
  try {
    const {
      name,
      surname,
      numer_telefonu,
      email,
      password,
      role,
      clan,
      routeRiwi,
      roomId,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
      });
    }

    const [roleRecord] = await Role.findOrCreate({
      where: {
        name: role,
      },
      defaults: {
        name: role,
      },
    });

    const [clanRecord] = await Clan.findOrCreate({
      where: {
        name: clan,
      },
      defaults: {
        name: clan,
      },
    });

    const [routeRecord] = await RouteRiwi.findOrCreate({
      where: {
        name: routeRiwi,
      },
      defaults: {
        name: routeRiwi,
      },
    });

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    const existingTeamLeaderByRoute = await TeamLeader.findOne({
      where: {
        routeRiwiId: routeRecord.id,
      },
    });

    if (existingTeamLeaderByRoute) {
      return res.status(409).json({
        message: `There is already a Team Leader assigned to the ${routeRiwi} route`,
      });
    }

    const existingTeamLeaderByClan = await TeamLeader.findOne({
      where: {
        clanId: clanRecord.id,
      },
    });

    if (existingTeamLeaderByClan) {
      return res.status(409).json({
        message: `There is already a Team Leader assigned to the ${clan} clan`,
      });
    }

    const existingTeamLeaderByEmail = await TeamLeader.findOne({
      where: {
        email,
      },
    });

    if (existingTeamLeaderByEmail) {
      return res.status(409).json({
        message: 'A Team Leader with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teamLeader = await TeamLeader.create({
      name,
      surname,
      numer_telefonu,
      email,
      password: passwordHash,
      roleId: roleRecord.id,
      clanId: clanRecord.id,
      routeRiwiId: routeRecord.id,
      roomId: room.id,
    });

    const teamLeaderResponse = await TeamLeader.findByPk(teamLeader.id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
        {
          model: Clan,
          attributes: ['id', 'name'],
        },
        {
          model: RouteRiwi,
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },
      ],
    });

    return res.status(201).json({
      msg: 'Team Leader created successfully',
      teamLeader: teamLeaderResponse,
    });
  } catch (error) {
    console.error('Error creating Team Leader:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getTeamLeaders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    const teamLeader = await TeamLeader.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
        {
          model: Clan,
          attributes: ['id', 'name'],
        },
        {
          model: RouteRiwi,
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },
      ],
    });

    if (!teamLeader) {
      return res.status(404).json({
        message: 'TeamLeader not found',
      });
    }

    return res.status(200).json(teamLeader);
  } catch (error) {
    console.error('Error getting TeamLeader:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const updateTeamLeader = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const teamLeader = await TeamLeader.findByPk(id);

    if (!teamLeader) {
      return res.status(404).json({
        message: "TeamLeader doesn't exist",
      });
    }

    const {
      name,
      surname,
      numer_telefonu,
      email,
      roleId,
      routeRiwiId,
      clanId,
      roomId,
    } = req.body;

    const newRoomId = roomId || teamLeader.roomId;
    const newRouteRiwiId = routeRiwiId || teamLeader.routeRiwiId;
    const newClanId = clanId || teamLeader.clanId;

    const room = await Room.findByPk(newRoomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    const existingTeamLeaderByRoute = await TeamLeader.findOne({
      where: {
        routeRiwiId: newRouteRiwiId,
      },
    });

    if (existingTeamLeaderByRoute && existingTeamLeaderByRoute.id !== id) {
      return res.status(409).json({
        message: 'There is already a Team Leader assigned to this route',
      });
    }

    const existingTeamLeaderByClan = await TeamLeader.findOne({
      where: {
        clanId: newClanId,
      },
    });

    if (existingTeamLeaderByClan && existingTeamLeaderByClan.id !== id) {
      return res.status(409).json({
        message: 'There is already a Team Leader assigned to this clan',
      });
    }

    const existingTeamLeaderByEmail = await TeamLeader.findOne({
      where: {
        email,
      },
    });

    if (existingTeamLeaderByEmail && existingTeamLeaderByEmail.id !== id) {
      return res.status(409).json({
        message: 'A Team Leader with this email already exists',
      });
    }

    await teamLeader.update({
      name,
      surname,
      numer_telefonu,
      email,
      roleId,
      routeRiwiId: newRouteRiwiId,
      clanId: newClanId,
      roomId: newRoomId,
    });

    const updatedTeamLeader = await TeamLeader.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
        {
          model: Clan,
          attributes: ['id', 'name'],
        },
        {
          model: RouteRiwi,
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },
      ],
    });

    return res.status(200).json({
      msg: 'TeamLeader updated successfully',
      teamLeader: updatedTeamLeader,
    });
  } catch (error) {
    console.error('Error updating TeamLeader:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteTeamLeader = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const teamLeader = await TeamLeader.findByPk(id);

    if (!teamLeader) {
      return res.status(404).json({
        message: "TeamLeader doesn't exist",
      });
    }

    await teamLeader.destroy();

    return res.status(200).json({
      message: 'TeamLeader deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting TeamLeader:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
