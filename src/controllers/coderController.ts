import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Coder from '../models/coder.js';
import City from '../models/city.js';
import Address from '../models/address.js';
import Identification from '../models/Identification.js';
import Role from '../models/role.js';
import Clan from '../models/clan.js';
import RouteRiwi from '../models/routeRiwi.js';

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
    } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
      });
    }

    const [city] = await City.findOrCreate({
      where: { name: cityName },
      defaults: {
        name: cityName,
      },
    });

    const [roleRecord] = await Role.findOrCreate({
      where: { name: role },
      defaults: {
        name: role,
      },
    });

    const [clanRecord] = await Clan.findOrCreate({
      where: { name: clan },
      defaults: {
        name: clan,
      },
    });

    const [routeRecord] = await RouteRiwi.findOrCreate({
      where: { name: routeRiwi },
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
    });

    const coderResponse = coder.toJSON();

    delete coderResponse.password;

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

export const getCoders = async (req: Request, res: Response) => {
  try {
    const coders = await Coder.findAll({
      attributes: {
        exclude: ['password'],
      },
    });

    return res.status(200).json(coders);
  } catch (error) {
    console.error('Error getting Coders:', error);

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
    } = req.body;

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
    });

    const coderResponse = coder.toJSON();

    delete coderResponse.password;

    return res.status(200).json({
      msg: 'Coder updated successfully',
      coder: coderResponse,
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
