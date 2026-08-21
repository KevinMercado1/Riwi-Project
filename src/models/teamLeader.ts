import { DataTypes, Model } from 'sequelize';
import db from '../config/db.js';

class TeamLeader extends Model {
  declare id: string;
  declare name: string;
  declare surname: string;
  declare numer_telefonu: string;
  declare email: string;
  declare password: string;
  declare roleId: string;
  declare routeRiwiId: string;
  declare clanId: string;
}

TeamLeader.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
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

    clanId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'clans',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'TeamLeader',
    tableName: 'team_leaders',
  }
);

export default TeamLeader;
