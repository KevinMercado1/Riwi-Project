import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Identification extends Model {
  declare id: string;
  declare type: string;
  declare number: string;
}

Identification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM('nationa_lID', 'foreigner_id ', 'passport'),
      allowNull: false,
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Identification',
    tableName: 'identifications',
  }
);

export default Identification;
