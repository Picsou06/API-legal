import mariadb from 'mariadb';
import dotenv from 'dotenv';

// Configuration de la base de données
dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default pool;
