import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class City extends Model {
  declare id: string;
  declare name: string;
}

City.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: 'City',
    tableName: 'cities',
  }
);

export default City;
