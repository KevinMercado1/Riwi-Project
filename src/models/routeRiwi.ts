import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class RouteRiwi extends Model {
  declare id: string;
  declare name: 'basic' | 'advanced';
}

RouteRiwi.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.ENUM('basic', 'advanced'),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'RouteRiwi',
    tableName: 'routes_riwi',
  }
);

export default RouteRiwi;
