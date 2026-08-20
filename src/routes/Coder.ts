import express, { type Request, type Response } from 'express';
import Coder from '../models/coder.js';
import { validateRequest } from '../middlewares/validateRequests.js';
import { createCodeSchema } from '../dto/create-coderschema.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(createCodeSchema),
  async (req: Request, res: Response) => {
    const { dowód_osobisty, name, surname, numer_telefonu, email } = req.body;

    try {
      const coder = await Coder.create({
        dowód_osobisty,
        name,
        surname,
        numer_telefonu,
        email,
      });
      res.json({ msg: 'Coder created successfully', coder });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const coders = await Coder.findAll();
    res.json(coders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { numer_telefonu, email } = req.body;

    const id = Number(req.params.id);

    const coderExists = await Coder.findByPk(id);

    if (!coderExists) {
      return res.status(404).json({ message: "Coder doesn't exist" });
    }

    await coderExists.update({ numer_telefonu, email });

    res.json({ message: 'coder updated', coder: coderExists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
