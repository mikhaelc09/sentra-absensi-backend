import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config()

const DB_NAME = process.env.DB_NAME || 'db_absensi';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';


const sequelize = new Sequelize(
    DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        dialect: DB_DIALECT,
        logging: false
    }
)

export default sequelize;