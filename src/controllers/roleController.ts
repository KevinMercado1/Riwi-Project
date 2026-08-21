import type { Request, Response } from 'express';
import Role from '../models/role.js';

export const registerRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const role = await Role.create({
      name,
    });

    res.status(201).json({
      message: 'Role created successfully',
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating role',
      error,
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching roles',
      error,
    });
  }
};

export const updateRole = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        message: 'Role not found',
      });
    }

    await role.update({
      name,
    });

    res.status(200).json({
      message: 'Role updated successfully',
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating role',
      error,
    });
  }
};

export const deleteRole = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        message: 'Role not found',
      });
    }

    await role.destroy();

    res.status(200).json({
      message: 'Role deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting role',
      error,
    });
  }
};
