import express, { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import Coder from '../models/coder.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createCodeSchema } from '../dto/create-coderschema.js';
import { loginCoderSchema } from '../dto/login-coder-schema.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(createCodeSchema),
  async (req: Request, res: Response) => {
    try {
      const { dowód_osobisty, name, surname, numer_telefonu, email, password } =
        req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      const coder = await Coder.create({
        dowód_osobisty,
        name,
        surname,
        numer_telefonu,
        email,
        password: passwordHash,
      });

      const coderResponse = coder.toJSON();
      delete coderResponse.password;

      res.status(201).json({
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

      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },
);

router.post(
  '/login',
  validateRequest(loginCoderSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const coder = await Coder.findOne({
        where: { email },
      });

      if (!coder) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const passwordCorrect = await bcrypt.compare(password, coder.password);

      if (!passwordCorrect) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const coderResponse = coder.toJSON();
      delete coderResponse.password;

      res.json({
        message: 'Login successful',
        coder: coderResponse,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: 'Internal server error',
      });
    }
  },
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const coders = await Coder.findAll({
      attributes: {
        exclude: ['password'],
      },
    });

    res.json(coders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { numer_telefonu, email } = req.body;
    const { id } = req.params;

    const coderExists = await Coder.findByPk(id);

    if (!coderExists) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    await coderExists.update({
      numer_telefonu,
      email,
    });

    const coderResponse = coderExists.toJSON();
    delete coderResponse.password;

    res.json({
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

    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const coderExists = await Coder.findByPk(id);

    if (!coderExists) {
      return res.status(404).json({
        message: "Coder doesn't exist",
      });
    }

    await coderExists.destroy();

    res.json({
      message: 'Coder deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

export default router;
