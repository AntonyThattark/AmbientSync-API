import mysql2 from 'mysql2';
import env from '../config/keys.js';


export const pool = mysql2.createPool({
    connectionLimit: 4,
    host: env.dbHost,
    database: env.dbName,
    user: env.dbUser,
    password: env.dbPassword,
    timezone: 'Z'
}).promise();

export const checkDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release(); 
        console.log('Database connection is healthy');
    } catch (error) {
        console.error('Error while connecting to database:', error);
        throw new Error('Database connection failure')
    }
}
