import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Coder extends Model {
  declare id: string;
  declare dowód_osobisty: string;
  declare name: string;
  declare surname: string;
  declare numer_telefonu: string;
  declare email: string;
  declare password: string;
}

Coder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    dowód_osobisty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numer_telefonu: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Coder',
    tableName: 'coders',
  },
);

export default Coder;
