import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Clan extends Model {
  declare id: string;
  declare name: string;
}

Clan.init(
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
    modelName: 'Clan',
    tableName: 'clans',
  }
);

export default Clan;
