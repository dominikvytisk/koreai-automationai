import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export const initDB = async () => {
  const db = await open({
    filename: path.join(__dirname, '../data/flights.db'),  // Soubor flights.db se vytvoří, pokud neexistuje
    driver: sqlite3.Database,
  });

  // Vytvoření tabulky, pokud neexistuje
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT,
      contact_number TEXT,
      boarding_city TEXT,
      destination_city TEXT,
      departure_date TEXT,
      return_date TEXT,
      email_address TEXT
    )
  `);

  return db;
};
