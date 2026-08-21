import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Address extends Model {
  declare id: string;
  declare address: string;
  declare cityId: string;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Address',
    tableName: 'addresses',
  }
);

export default Address;
