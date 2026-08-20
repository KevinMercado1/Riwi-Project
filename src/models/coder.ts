import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Coder extends Model {
  declare id: number;
  declare dowód_osobisty: number;
  declare name: string;
  declare surname: string;
  declare numer_telefonu: string;
  declare email: string;
  declare password: string;
}

Coder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dowód_osobisty: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Coder',
    tableName: 'coders',
  }
);

export default Coder;
