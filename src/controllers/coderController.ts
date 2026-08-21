import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Coder from '../models/coder.js';

export const registerCoder = async (req: Request, res: Response) => {
  try {
    const {
      identificationId,
      name,
      surname,
      numer_telefonu,
      email,
      password,
      addressId,
      roleId,
      clanId,
      routeRiwiId,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const coder = await Coder.create({
      identificationId,
      name,
      surname,
      numer_telefonu,
      email,
      password: passwordHash,
      addressId,
      roleId,
      clanId,
      routeRiwiId,
    });

    const coderResponse = coder.toJSON();
    delete coderResponse.password;

    return res.status(201).json({
      msg: 'Coder created successfully',
      coder: coderResponse,
    });
  } catch (error) {
    console.log(error);

    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

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

    return res.json(coders);
  } catch (error) {
    console.log(error);

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

    const { id } = req.params;

    const coderExists = await Coder.findByPk(id);

    if (!coderExists) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    await coderExists.update({
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

    const coderResponse = coderExists.toJSON();
    delete coderResponse.password;

    return res.json({
      msg: 'Coder updated successfully',
      coder: coderResponse,
    });
  } catch (error) {
    console.log(error);

    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

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

    const coderExists = await Coder.findByPk(id);

    if (!coderExists) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    await coderExists.destroy();

    return res.json({
      message: 'Coder deleted successfully',
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
