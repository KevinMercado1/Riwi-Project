import { body } from 'express-validator';

export const registerTeamLeaderValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),

  body('surname').trim().notEmpty().withMessage('Surname is required'),

  body('numer_telefonu')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('email').trim().isEmail().withMessage('Email must be valid'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters'),

  body('role').equals('team_leader').withMessage('Role must be team_leader'),

  body('clan').trim().notEmpty().withMessage('Clan is required'),

  body('routeRiwi').trim().notEmpty().withMessage('Route Riwi is required'),

  body('room').trim().notEmpty().withMessage('Room is required'),

  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer greater than 0'),
];
