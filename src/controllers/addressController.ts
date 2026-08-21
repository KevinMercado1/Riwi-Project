import type { Request, Response } from 'express';
import Address from '../models/address.js';

export const registerAddress = async (req: Request, res: Response) => {
  try {
    const { address, cityId } = req.body;

    const newAddress = await Address.create({
      address,
      cityId,
    });

    res.status(201).json({
      message: 'Address created successfully',
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating address',
      error,
    });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.findAll();

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching addresses',
      error,
    });
  }
};

export const updateAddress = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { address, cityId } = req.body;

    const existingAddress = await Address.findByPk(id);

    if (!existingAddress) {
      return res.status(404).json({
        message: 'Address not found',
      });
    }

    await existingAddress.update({
      address,
      cityId,
    });

    res.status(200).json({
      message: 'Address updated successfully',
      address: existingAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating address',
      error,
    });
  }
};

export const deleteAddress = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({
        message: 'Address not found',
      });
    }

    await address.destroy();

    res.status(200).json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Address deleted successfully',
    });
  }
};
