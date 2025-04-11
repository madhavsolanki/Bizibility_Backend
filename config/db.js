import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { createUsersTable } from './table.js';

dotenv.config();


let connection;


const initDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log(`✅ Connected to MySQL database DB_NAME: ${process.env.DB_NAME}`);
    

    // Tables
    createUsersTable(connection);
     

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}





export { initDB, connection }