import type { Request, Response } from 'express';
import Room from '../models/room.js';

// CREATE
export const registerRoom = async (req: Request, res: Response) => {
  try {
    const { name, capacity } = req.body;

    const room = await Room.create({
      name,
      capacity,
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating room',
      error,
    });
  }
};

// READ ALL
export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.findAll();

    res.status(200).json({
      message: 'Rooms retrieved successfully',
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving rooms',
      error,
    });
  }
};

// READ ONE
export const getRoomById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    res.status(200).json({
      message: 'Room retrieved successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving room',
      error,
    });
  }
};

// UPDATE
export const updateRoom = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    await room.update({
      name,
      capacity,
    });

    res.status(200).json({
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating room',
      error,
    });
  }
};

// DELETE
export const deleteRoom = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    await room.destroy();

    res.status(200).json({
      message: 'Room deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting room',
      error,
    });
  }
};
