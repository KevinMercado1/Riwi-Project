import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import sequelize from '../config/db.js';

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
      roomName,
    } = req.body;

    //VALIDATIONS

    if (
      !name ||
      !surname ||
      !numer_telefonu ||
      !email ||
      !password ||
      !identificationType ||
      !identificationNumber ||
      !address ||
      !cityName ||
      !role ||
      !clan ||
      !routeRiwi
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (!roomId && !roomName) {
      return res.status(400).json({
        message: 'roomId or roomName is required',
      });
    }

    if (role !== 'coder') {
      return res.status(400).json({
        message: 'Role must be coder',
      });
    }

    // TRANSACTION

    const coderResponse = await sequelize.transaction(async (transaction) => {
      //ROOM

      let room;

      if (roomId) {
        room = await Room.findByPk(roomId, {
          transaction,
        });
      } else {
        room = await Room.findOne({
          where: {
            name: roomName,
          },
          transaction,
        });
      }

      if (!room) {
        throw new Error('ROOM_NOT_FOUND');
      }

      // ROOM CAPACITY

      const codersInRoom = await Coder.count({
        where: {
          roomId: room.id,
        },
        transaction,
      });

      if (codersInRoom >= room.capacity) {
        throw new Error('ROOM_FULL');
      }

      // EMAIL

      const existingCoderByEmail = await Coder.findOne({
        where: {
          email,
        },
        transaction,
      });

      if (existingCoderByEmail) {
        throw new Error('EMAIL_EXISTS');
      }

      //  IDENTIFICATION

      const existingIdentification = await Identification.findOne({
        where: {
          number: identificationNumber,
        },
        transaction,
      });

      if (existingIdentification) {
        throw new Error('IDENTIFICATION_EXISTS');
      }

      // CITY

      const [city] = await City.findOrCreate({
        where: {
          name: cityName,
        },
        defaults: {
          name: cityName,
        },
        transaction,
      });

      // ROLE

      const [roleRecord] = await Role.findOrCreate({
        where: {
          name: role,
        },
        defaults: {
          name: role,
        },
        transaction,
      });

      //  CLAN

      const [clanRecord] = await Clan.findOrCreate({
        where: {
          name: clan,
        },
        defaults: {
          name: clan,
        },
        transaction,
      });

      //  ROUTE

      const [routeRecord] = await RouteRiwi.findOrCreate({
        where: {
          name: routeRiwi,
        },
        defaults: {
          name: routeRiwi,
        },
        transaction,
      });

      //  IDENTIFICATION CREATE

      const identification = await Identification.create(
        {
          type: identificationType,
          number: identificationNumber,
        },
        {
          transaction,
        }
      );

      //  ADDRESS CREATE

      const newAddress = await Address.create(
        {
          address,
          cityId: city.id,
        },
        {
          transaction,
        }
      );

      // PASSWORD

      const passwordHash = await bcrypt.hash(password, 10);

      // CODER CREATE

      const coder = await Coder.create(
        {
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
        },
        {
          transaction,
        }
      );

      //  RESPONSE

      const response = await Coder.findByPk(coder.id, {
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

        transaction,
      });

      return response;
    });

    //  SUCCESS

    return res.status(201).json({
      msg: 'Coder created successfully',
      coder: coderResponse,
    });
  } catch (error) {
    console.error('Error creating Coder:', error);

    if (error instanceof Error) {
      if (error.message === 'ROOM_NOT_FOUND') {
        return res.status(404).json({
          message: 'Room not found',
        });
      }

      if (error.message === 'ROOM_FULL') {
        return res.status(409).json({
          message: 'The room is full',
        });
      }

      if (error.message === 'EMAIL_EXISTS') {
        return res.status(409).json({
          message: 'A Coder with this email already exists',
        });
      }

      if (error.message === 'IDENTIFICATION_EXISTS') {
        return res.status(409).json({
          message: 'A Coder with this identification already exists',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET CODER

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
  res: Response
) => {
  try {
    const { id } = req.params;

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

    const updatedCoder = await sequelize.transaction(async (transaction) => {
      // CODER

      const coder = await Coder.findByPk(id, {
        transaction,
      });

      if (!coder) {
        throw new Error('CODER_NOT_FOUND');
      }

      // ROOM

      let room;

      if (roomId) {
        room = await Room.findByPk(roomId, {
          transaction,
        });
      } else if (roomName) {
        room = await Room.findOne({
          where: {
            name: roomName,
          },
          transaction,
        });
      } else {
        room = await Room.findByPk(coder.roomId, {
          transaction,
        });
      }

      if (!room) {
        throw new Error('ROOM_NOT_FOUND');
      }

      //  ROOM CAPACITY

      if (coder.roomId !== room.id) {
        const codersInRoom = await Coder.count({
          where: {
            roomId: room.id,
          },
          transaction,
        });

        if (codersInRoom >= room.capacity) {
          throw new Error('ROOM_FULL');
        }
      }

      //  EMAIL

      if (email) {
        const existingCoderByEmail = await Coder.findOne({
          where: {
            email,
          },
          transaction,
        });

        if (existingCoderByEmail && existingCoderByEmail.id !== id) {
          throw new Error('EMAIL_EXISTS');
        }
      }

      // IDENTIFICATION

      if (identificationId) {
        const identification = await Identification.findByPk(identificationId, {
          transaction,
        });

        if (!identification) {
          throw new Error('IDENTIFICATION_NOT_FOUND');
        }
      }

      //  UPDATE DATA

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

      // UPDATE

      await coder.update(updateData, {
        transaction,
      });

      const result = await Coder.findByPk(id, {
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

        transaction,
      });

      return result;
    });

    return res.status(200).json({
      msg: 'Coder updated successfully',
      coder: updatedCoder,
    });
  } catch (error) {
    console.error('Error updating Coder:', error);

    if (error instanceof Error) {
      if (error.message === 'CODER_NOT_FOUND') {
        return res.status(404).json({
          message: "Coder doesn't exist",
        });
      }

      if (error.message === 'ROOM_NOT_FOUND') {
        return res.status(404).json({
          message: 'Room not found',
        });
      }

      if (error.message === 'ROOM_FULL') {
        return res.status(409).json({
          message: 'The room is full',
        });
      }

      if (error.message === 'EMAIL_EXISTS') {
        return res.status(409).json({
          message: 'A Coder with this email already exists',
        });
      }

      if (error.message === 'IDENTIFICATION_NOT_FOUND') {
        return res.status(404).json({
          message: 'Identification not found',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE CODER

export const deleteCoder = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const coder = await Coder.findByPk(id, {
        transaction,
      });

      if (!coder) {
        throw new Error('CODER_NOT_FOUND');
      }

      await coder.destroy({
        transaction,
      });
    });

    return res.status(200).json({
      message: 'Coder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Coder:', error);

    if (error instanceof Error && error.message === 'CODER_NOT_FOUND') {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
