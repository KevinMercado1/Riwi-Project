import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Coder from '../models/coder.js';
import TeamLeader from '../models/teamLeader.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const coder = await Coder.findOne({
      where: { email },
    });

    if (coder) {
      const passwordValid = await bcrypt.compare(password, coder.password);

      if (!passwordValid) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        id: coder.id,
        role: 'coder',
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
      });
    }

    const teamLeader = await TeamLeader.findOne({
      where: { email },
    });

    if (teamLeader) {
      const passwordValid = await bcrypt.compare(password, teamLeader.password);

      if (!passwordValid) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        id: teamLeader.id,
        role: 'teamleader',
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
      });
    }

    return res.status(401).json({
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
