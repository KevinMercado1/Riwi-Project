import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user: {
    id: string;
    role: 'coder' | 'teamleader';
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization token is required',
      });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Invalid authorization format',
      });
    }

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log('JWT USER:', req.user);

    next();
  } catch (error) {
    console.error('JWT ERROR:', error);

    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};
