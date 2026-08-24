import express, { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import Coder from '../models/coder.js';
import TeamLeader from '../models/teamLeader.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { loginSchema } from '../dto/login-schema.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

router.post(
  '/login',
  validateRequest(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const coder = await Coder.findOne({
        where: { email },
      });

      const teamLeader = await TeamLeader.findOne({
        where: { email },
      });

      const user = coder || teamLeader;

      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const passwordCorrect = await bcrypt.compare(password, user.password);

      if (!passwordCorrect) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const role = coder ? 'coder' : 'teamleader';

      const token = generateToken({
        id: user.id,
        role,
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error('Login error:', error);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
);

export default router;
