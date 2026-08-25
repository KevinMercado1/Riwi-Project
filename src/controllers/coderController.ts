import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Coder from '../models/coder.js';
import City from '../models/city.js';
import Address from '../models/address.js';
import Identification from '../models/Identification.js';
import Role from '../models/role.js';
import Clan from '../models/clan.js';
import RouteRiwi from '../models/routeRiwi.js';
import Room from '../models/room.js';

import type { AuthRequest } from '../middlewares/authMiddleware.js';

// REGISTER CODER

export const registerCoder = async (req: Request, res: Response) => {
  try {
    const {
      name,
      surname,
      numer_telefonu,
      email,
      password,
      identificationType,
      identificationNumber,
      address,
      cityName,
      role,
      clan,
      routeRiwi,
      roomId,
    } = req.body;

    // PASSWORD

    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
      });
    }

    // ROOM

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    // CHECK ROOM CAPACITY

    const codersInRoom = await Coder.count({
      where: {
        roomId: room.id,
      },
    });

    if (codersInRoom >= room.capacity) {
      return res.status(409).json({
        message: `Room ${room.name} is full`,
        capacity: room.capacity,
        currentCoders: codersInRoom,
      });
    }

    // CITY

    const [city] = await City.findOrCreate({
      where: {
        name: cityName,
      },
      defaults: {
        name: cityName,
      },
    });

    // ROLE

    const [roleRecord] = await Role.findOrCreate({
      where: {
        name: role,
      },
      defaults: {
        name: role,
      },
    });

    // CLAN

    const [clanRecord] = await Clan.findOrCreate({
      where: {
        name: clan,
      },
      defaults: {
        name: clan,
      },
    });

    // ROUTE

    const [routeRecord] = await RouteRiwi.findOrCreate({
      where: {
        name: routeRiwi,
      },
      defaults: {
        name: routeRiwi,
      },
    });

    // CHECK EMAIL

    const existingCoderByEmail = await Coder.findOne({
      where: {
        email,
      },
    });

    if (existingCoderByEmail) {
      return res.status(409).json({
        message: 'A Coder with this email already exists',
      });
    }

    // CHECK IDENTIFICATION

    const existingIdentification = await Identification.findOne({
      where: {
        number: identificationNumber,
      },
    });

    if (existingIdentification) {
      return res.status(409).json({
        message: 'A Coder with this identification already exists',
      });
    }

    // IDENTIFICATION

    const identification = await Identification.create({
      type: identificationType,
      number: identificationNumber,
    });

    // ADDRESS

    const newAddress = await Address.create({
      address,
      cityId: city.id,
    });

    // PASSWORD HASH

    const passwordHash = await bcrypt.hash(password, 10);

    // CREATE CODER

    const coder = await Coder.create({
      identificationId: identification.id,
      name,
      surname,
      numer_telefonu,
      email,
      password: passwordHash,
      addressId: newAddress.id,
      roleId: roleRecord.id,
      clanId: clanRecord.id,
      routeRiwiId: routeRecord.id,
      roomId: room.id,
    });

    // GET CODER WITH RELATIONS

    const coderResponse = await Coder.findByPk(coder.id, {
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
          attributes: ['id', 'name'],
        },

        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },

        {
          model: Address,
          attributes: ['id', 'address'],

          include: [
            {
              model: City,
              attributes: ['id', 'name'],
            },
          ],
        },

        {
          model: Identification,
          attributes: ['id', 'type', 'number'],
        },
      ],
    });

    return res.status(201).json({
      msg: 'Coder created successfully',
      coder: coderResponse,
    });
  } catch (error) {
    console.error('Error creating Coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET AUTHENTICATED CODER

export const getCoders = async (req: AuthRequest, res: Response) => {
  try {
    // CHECK AUTHENTICATION

    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    // CHECK ROLE

    if (req.user.role !== 'coder') {
      return res.status(403).json({
        message: 'Only coders can access this resource',
      });
    }

    // GET CODER WITH RELATIONS

    const coder = await Coder.findByPk(req.user.id, {
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
          attributes: ['id', 'name'],
        },

        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },

        {
          model: Address,
          attributes: ['id', 'address'],

          include: [
            {
              model: City,
              attributes: ['id', 'name'],
            },
          ],
        },

        {
          model: Identification,
          attributes: ['id', 'type', 'number'],
        },
      ],
    });

    // CHECK CODER

    if (!coder) {
      return res.status(404).json({
        message: 'Coder not found',
      });
    }

    return res.status(200).json(coder);
  } catch (error) {
    console.error('Error getting Coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE CODER

export const updateCoder = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // FIND CODER

    const coder = await Coder.findByPk(id);

    if (!coder) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    // REQUEST DATA

    const {
      identificationId,
      name,
      surname,
      numer_telefonu,
      email,
      addressId,
      roleId,
      clanId,
      routeRiwiId,
      roomId,
    } = req.body;

    // ROOM

    const newRoomId = roomId || coder.roomId;

    const room = await Room.findByPk(newRoomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    // CHECK ROOM CAPACITY

    if (coder.roomId !== room.id) {
      const codersInRoom = await Coder.count({
        where: {
          roomId: room.id,
        },
      });

      if (codersInRoom >= room.capacity) {
        return res.status(409).json({
          message: `Room ${room.name} is full`,
          capacity: room.capacity,
          currentCoders: codersInRoom,
        });
      }
    }

    // UPDATE CODER

    await coder.update({
      identificationId,
      name,
      surname,
      numer_telefonu,
      email,
      addressId,
      roleId,
      clanId,
      routeRiwiId,
      roomId: room.id,
    });

    // GET UPDATED CODER WITH RELATIONS

    const updatedCoder = await Coder.findByPk(id, {
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
          attributes: ['id', 'name'],
        },

        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'capacity'],
        },

        {
          model: Address,
          attributes: ['id', 'address'],

          include: [
            {
              model: City,
              attributes: ['id', 'name'],
            },
          ],
        },

        {
          model: Identification,
          attributes: ['id', 'type', 'number'],
        },
      ],
    });

    return res.status(200).json({
      msg: 'Coder updated successfully',
      coder: updatedCoder,
    });
  } catch (error) {
    console.error('Error updating Coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE CODER

export const deleteCoder = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // FIND CODER

    const coder = await Coder.findByPk(id);

    if (!coder) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    // DELETE CODER

    await coder.destroy();

    return res.status(200).json({
      message: 'Coder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
