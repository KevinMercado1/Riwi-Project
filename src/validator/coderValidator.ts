import { body } from 'express-validator';

export const registerCoderValidator = [
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

  body('identificationType')
    .trim()
    .notEmpty()
    .withMessage('Identification type is required'),

  body('identificationNumber')
    .trim()
    .notEmpty()
    .withMessage('Identification number is required'),

  body('address').trim().notEmpty().withMessage('Address is required'),

  body('cityName').trim().notEmpty().withMessage('City is required'),

  body('role').trim().notEmpty().withMessage('Role is required'),

  body('clan').trim().notEmpty().withMessage('Clan is required'),

  body('routeRiwi').trim().notEmpty().withMessage('Route Riwi is required'),

  body().custom((value) => {
    if (!value.roomId && !value.roomName) {
      throw new Error('roomId or roomName is required');
    }

    return true;
  }),
];
