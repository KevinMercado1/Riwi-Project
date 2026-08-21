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
    console.error('Error creating coder:', error);

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
    console.error('Error getting coders:', error);

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
    console.error('Error updating coder:', error);

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
    console.error('Error deleting coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
