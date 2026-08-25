import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Room extends Model {
  declare id: string;
  declare name: string;
  declare capacity: number;
}

Room.init(
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

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Room',
    tableName: 'Rooms',
    timestamps: true,
  }
);

export default Room;
