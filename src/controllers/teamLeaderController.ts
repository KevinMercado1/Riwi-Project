import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import sequelize from '../config/db.js';

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
      room,
      capacity,
    } = req.body;

    if (
      !name ||
      !surname ||
      !numer_telefonu ||
      !email ||
      !password ||
      !role ||
      !clan ||
      !routeRiwi ||
      !room ||
      capacity === undefined
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (role !== 'team_leader') {
      return res.status(400).json({
        message: 'Role must be team_leader',
      });
    }

    if (Number(capacity) <= 0) {
      return res.status(400).json({
        message: 'Capacity must be greater than 0',
      });
    }

    const teamLeaderResponse = await sequelize.transaction(
      async (transaction) => {
        // Check email
        const existingTeamLeaderByEmail = await TeamLeader.findOne({
          where: {
            email,
          },
          transaction,
        });

        if (existingTeamLeaderByEmail) {
          throw new Error('TEAM_LEADER_EMAIL_EXISTS');
        }

        // Find or create Role
        const [roleRecord] = await Role.findOrCreate({
          where: {
            name: role,
          },
          defaults: {
            name: role,
          },
          transaction,
        });

        // Find or create Clan
        const [clanRecord] = await Clan.findOrCreate({
          where: {
            name: clan,
          },
          defaults: {
            name: clan,
          },
          transaction,
        });

        // Find or create Route
        const [routeRecord] = await RouteRiwi.findOrCreate({
          where: {
            name: routeRiwi,
          },
          defaults: {
            name: routeRiwi,
          },
          transaction,
        });

        // Check if route already has a Team Leader
        const existingTeamLeaderByRoute = await TeamLeader.findOne({
          where: {
            routeRiwiId: routeRecord.id,
          },
          transaction,
        });

        if (existingTeamLeaderByRoute) {
          throw new Error('ROUTE_ALREADY_ASSIGNED');
        }

        // Check if clan already has a Team Leader
        const existingTeamLeaderByClan = await TeamLeader.findOne({
          where: {
            clanId: clanRecord.id,
          },
          transaction,
        });

        if (existingTeamLeaderByClan) {
          throw new Error('CLAN_ALREADY_ASSIGNED');
        }

        // Check if room already exists
        const existingRoom = await Room.findOne({
          where: {
            name: room,
          },
          transaction,
        });

        if (existingRoom) {
          throw new Error('ROOM_EXISTS');
        }

        // Create Room
        const roomRecord = await Room.create(
          {
            name: room,
            capacity: Number(capacity),
          },
          {
            transaction,
          }
        );

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create Team Leader
        const teamLeader = await TeamLeader.create(
          {
            name,
            surname,
            numer_telefonu,
            email,
            password: passwordHash,
            roleId: roleRecord.id,
            clanId: clanRecord.id,
            routeRiwiId: routeRecord.id,
            roomId: roomRecord.id,
          },
          {
            transaction,
          }
        );

        // Get created Team Leader
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
          transaction,
        });

        return teamLeaderResponse;
      }
    );

    return res.status(201).json({
      msg: 'Team Leader created successfully',
      teamLeader: teamLeaderResponse,
    });
  } catch (error) {
    console.error('Error creating Team Leader:', error);

    if (error instanceof Error) {
      if (error.message === 'TEAM_LEADER_EMAIL_EXISTS') {
        return res.status(409).json({
          message: 'A Team Leader with this email already exists',
        });
      }

      if (error.message === 'ROUTE_ALREADY_ASSIGNED') {
        return res.status(409).json({
          message: `There is already a Team Leader assigned to the ${req.body.routeRiwi} route`,
        });
      }

      if (error.message === 'CLAN_ALREADY_ASSIGNED') {
        return res.status(409).json({
          message: `There is already a Team Leader assigned to the ${req.body.clan} clan`,
        });
      }

      if (error.message === 'ROOM_EXISTS') {
        return res.status(409).json({
          message: `Room ${req.body.room} already exists`,
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getTeamLeaders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    if (req.user.role !== 'teamleader') {
      return res.status(403).json({
        message: 'Only team leaders can access this resource',
      });
    }

    const teamLeader = await TeamLeader.findByPk(req.user.id, {
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
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      surname,
      numer_telefonu,
      email,
      roleId,
      routeRiwiId,
      clanId,
      roomId,
      roomName,
      capacity,
    } = req.body;

    const updatedTeamLeader = await sequelize.transaction(
      async (transaction) => {
        const teamLeader = await TeamLeader.findByPk(id, {
          transaction,
        });

        if (!teamLeader) {
          throw new Error('TEAM_LEADER_NOT_FOUND');
        }

        const newRouteRiwiId = routeRiwiId || teamLeader.routeRiwiId;

        const newClanId = clanId || teamLeader.clanId;

        const existingTeamLeaderByRoute = await TeamLeader.findOne({
          where: {
            routeRiwiId: newRouteRiwiId,
          },
          transaction,
        });

        if (existingTeamLeaderByRoute && existingTeamLeaderByRoute.id !== id) {
          throw new Error('ROUTE_ALREADY_ASSIGNED');
        }

        const existingTeamLeaderByClan = await TeamLeader.findOne({
          where: {
            clanId: newClanId,
          },
          transaction,
        });

        if (existingTeamLeaderByClan && existingTeamLeaderByClan.id !== id) {
          throw new Error('CLAN_ALREADY_ASSIGNED');
        }

        if (email) {
          const existingTeamLeaderByEmail = await TeamLeader.findOne({
            where: {
              email,
            },
            transaction,
          });

          if (
            existingTeamLeaderByEmail &&
            existingTeamLeaderByEmail.id !== id
          ) {
            throw new Error('TEAM_LEADER_EMAIL_EXISTS');
          }
        }

        let newRoomId = teamLeader.roomId;

        if (roomId) {
          const roomRecord = await Room.findByPk(roomId, {
            transaction,
          });

          if (!roomRecord) {
            throw new Error('ROOM_NOT_FOUND');
          }

          newRoomId = roomRecord.id;

          if (capacity !== undefined) {
            if (Number(capacity) <= 0) {
              throw new Error('INVALID_CAPACITY');
            }

            await roomRecord.update(
              {
                capacity: Number(capacity),
              },
              {
                transaction,
              }
            );
          }
        } else if (roomName) {
          let roomRecord = await Room.findOne({
            where: {
              name: roomName,
            },
            transaction,
          });

          // Create new room
          if (!roomRecord) {
            if (capacity === undefined) {
              throw new Error('CAPACITY_REQUIRED');
            }

            if (Number(capacity) <= 0) {
              throw new Error('INVALID_CAPACITY');
            }

            roomRecord = await Room.create(
              {
                name: roomName,
                capacity: Number(capacity),
              },
              {
                transaction,
              }
            );
          } else if (capacity !== undefined) {
            if (Number(capacity) <= 0) {
              throw new Error('INVALID_CAPACITY');
            }

            await roomRecord.update(
              {
                capacity: Number(capacity),
              },
              {
                transaction,
              }
            );
          }

          newRoomId = roomRecord.id;
        } else if (capacity !== undefined) {
          if (Number(capacity) <= 0) {
            throw new Error('INVALID_CAPACITY');
          }

          const roomRecord = await Room.findByPk(teamLeader.roomId, {
            transaction,
          });

          if (roomRecord) {
            await roomRecord.update(
              {
                capacity: Number(capacity),
              },
              {
                transaction,
              }
            );
          }
        }

        const updateData: Record<string, unknown> = {
          roomId: newRoomId,
        };

        if (name !== undefined) {
          updateData.name = name;
        }

        if (surname !== undefined) {
          updateData.surname = surname;
        }

        if (numer_telefonu !== undefined) {
          updateData.numer_telefonu = numer_telefonu;
        }

        if (email !== undefined) {
          updateData.email = email;
        }

        if (roleId !== undefined) {
          updateData.roleId = roleId;
        }

        if (routeRiwiId !== undefined) {
          updateData.routeRiwiId = routeRiwiId;
        }

        if (clanId !== undefined) {
          updateData.clanId = clanId;
        }

        await teamLeader.update(updateData, {
          transaction,
        });

        const result = await TeamLeader.findByPk(id, {
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
          transaction,
        });

        return result;
      }
    );

    return res.status(200).json({
      msg: 'TeamLeader updated successfully',
      teamLeader: updatedTeamLeader,
    });
  } catch (error) {
    console.error('Error updating TeamLeader:', error);

    if (error instanceof Error) {
      if (error.message === 'TEAM_LEADER_NOT_FOUND') {
        return res.status(404).json({
          message: "TeamLeader doesn't exist",
        });
      }

      if (error.message === 'ROUTE_ALREADY_ASSIGNED') {
        return res.status(409).json({
          message: 'There is already a Team Leader assigned to this route',
        });
      }

      if (error.message === 'CLAN_ALREADY_ASSIGNED') {
        return res.status(409).json({
          message: 'There is already a Team Leader assigned to this clan',
        });
      }

      if (error.message === 'TEAM_LEADER_EMAIL_EXISTS') {
        return res.status(409).json({
          message: 'A Team Leader with this email already exists',
        });
      }

      if (error.message === 'ROOM_NOT_FOUND') {
        return res.status(404).json({
          message: 'Room not found',
        });
      }

      if (error.message === 'CAPACITY_REQUIRED') {
        return res.status(400).json({
          message: 'Capacity is required when creating a new room',
        });
      }

      if (error.message === 'INVALID_CAPACITY') {
        return res.status(400).json({
          message: 'Capacity must be greater than 0',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteTeamLeader = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const teamLeader = await TeamLeader.findByPk(id, {
        transaction,
      });

      if (!teamLeader) {
        throw new Error('TEAM_LEADER_NOT_FOUND');
      }

      await teamLeader.destroy({
        transaction,
      });
    });

    return res.status(200).json({
      message: 'TeamLeader deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting TeamLeader:', error);

    if (error instanceof Error && error.message === 'TEAM_LEADER_NOT_FOUND') {
      return res.status(404).json({
        message: "TeamLeader doesn't exist",
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
