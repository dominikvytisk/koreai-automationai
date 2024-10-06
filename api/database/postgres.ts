import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.bookflight_URL,
});

export const initDB = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                unique_id TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 6),
                fullname TEXT,
                contact_number TEXT,
                boarding_city TEXT,
                destination_city TEXT,
                departure_date DATE,
                return_date DATE,
                email_address TEXT
            )
        `);
    } finally {
        client.release();
    }
    return pool;
};
