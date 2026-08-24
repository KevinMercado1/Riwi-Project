import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } =
  process.env;

const db = new Sequelize(
  DATABASE_NAME || '',
  DATABASE_USER || '',
  DATABASE_PASSWORD || '',
  {
    host: DATABASE_HOST || '',
    port: 5433,
    dialect: 'postgres',
  }
);

export default db;
