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
      roomName,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
      });
    }

    if (!roomId && !roomName) {
      return res.status(400).json({
        message: 'roomId or roomName is required',
      });
    }

    let room;

    if (roomId) {
      room = await Room.findByPk(roomId);
    } else if (roomName) {
      room = await Room.findOne({
        where: {
          name: roomName,
        },
      });
    }

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    const codersInRoom = await Coder.count({
      where: {
        roomId: room.id,
      },
    });

    if (codersInRoom >= room.capacity) {
      return res.status(409).json({
        message: `Room ${room.name} is full`,
        currentCoders: codersInRoom,
      });
    }

    const [city] = await City.findOrCreate({
      where: {
        name: cityName,
      },
      defaults: {
        name: cityName,
      },
    });

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

    const identification = await Identification.create({
      type: identificationType,
      number: identificationNumber,
    });

    const newAddress = await Address.create({
      address,
      cityId: city.id,
    });

    const passwordHash = await bcrypt.hash(password, 10);

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
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name'],
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

export const getCoders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    if (req.user.role !== 'coder') {
      return res.status(403).json({
        message: 'Only coders can access this resource',
      });
    }

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
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name'],
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

export const updateCoder = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const coder = await Coder.findByPk(id);

    if (!coder) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

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
      roomName,
    } = req.body;

    let room;

    if (roomId) {
      room = await Room.findByPk(roomId);
    } else if (roomName) {
      room = await Room.findOne({
        where: {
          name: roomName,
        },
      });
    } else {
      room = await Room.findByPk(coder.roomId);
    }

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    if (coder.roomId !== room.id) {
      const codersInRoom = await Coder.count({
        where: {
          roomId: room.id,
        },
      });

      if (codersInRoom >= room.capacity) {
        return res.status(409).json({
          message: `Room ${room.name} is full`,
          currentCoders: codersInRoom,
        });
      }
    }

    if (email) {
      const existingCoderByEmail = await Coder.findOne({
        where: {
          email,
        },
      });

      if (existingCoderByEmail && existingCoderByEmail.id !== id) {
        return res.status(409).json({
          message: 'A Coder with this email already exists',
        });
      }
    }

    if (identificationId) {
      const identification = await Identification.findByPk(identificationId);

      if (!identification) {
        return res.status(404).json({
          message: 'Identification not found',
        });
      }
    }

    const updateData: {
      identificationId?: string;
      name?: string;
      surname?: string;
      numer_telefonu?: string;
      email?: string;
      addressId?: string;
      roleId?: string;
      clanId?: string;
      routeRiwiId?: string;
      roomId: string;
    } = {
      roomId: room.id,
    };

    if (identificationId !== undefined) {
      updateData.identificationId = identificationId;
    }

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

    if (addressId !== undefined) {
      updateData.addressId = addressId;
    }

    if (roleId !== undefined) {
      updateData.roleId = roleId;
    }

    if (clanId !== undefined) {
      updateData.clanId = clanId;
    }

    if (routeRiwiId !== undefined) {
      updateData.routeRiwiId = routeRiwiId;
    }

    await coder.update(updateData);

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
          as: 'routeRiwi',
          attributes: ['id', 'name'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name'],
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

export const deleteCoder = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const coder = await Coder.findByPk(id);

    if (!coder) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

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
