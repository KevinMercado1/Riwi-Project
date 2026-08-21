import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import TeamLeader from '../models/teamLeader.js';

export const registerTeamLeader = async (req: Request, res: Response) => {
  try {
    const {
      name,
      surname,
      numer_telefonu,
      email,
      password,
      roleId,
      routeRiwiId,
      clanId,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const Teamleader = await TeamLeader.create({
      name,
      surname,
      numer_telefonu,
      email,
      password: passwordHash,
      roleId,
      routeRiwiId,
      clanId,
    });

    const TeamleaderResponse = Teamleader.toJSON();
    delete TeamleaderResponse.password;

    return res.status(201).json({
      msg: 'Teamleader created successfully',
      Teamleader: TeamleaderResponse,
    });
  } catch (error) {
    console.error('Error creating coder:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getTeamLeaders = 
