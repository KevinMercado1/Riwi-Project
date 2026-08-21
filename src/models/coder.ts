import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Coder extends Model {
  declare id: string;
  declare identificationId: string;
  declare name: string;
  declare surname: string;
  declare numer_telefonu: string;
  declare email: string;
  declare password: string;
  declare roleId: string;
  declare addressId: string;
  declare clanId: string;
  declare routeRiwiId: string;
}

Coder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    identificationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'identifications',
        key: 'id',
      },
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
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },

    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id',
      },
    },

    clanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clans',
        key: 'id',
      },
    },

    routeRiwiId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'routes_riwi',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Coder',
    tableName: 'coders',
    timestamps: true,
  }
);

export default Coder;
