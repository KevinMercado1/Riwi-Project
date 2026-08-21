import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class Role extends Model {
  declare id: string;
  declare name: 'coder' | 'team_leader' | 'admin';
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.ENUM('coder', 'team_leader', 'admin'),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Role',
    tableName: 'roles',
  }
);

export default Role;
