import { Request, Response } from 'express';
import { initDB } from '../database/postgres';
import { Booking } from '../models/booking';

export const bookFlight = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const { fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address }: Booking = req.body;
  
    const db = await initDB();
    const client = await db.connect();
    try {
        const result = await client.query(
            'INSERT INTO bookings (fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING unique_id',
            [fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address]
        );
        const uniqueId = result.rows[0].unique_id;
        res.status(201).json({ message: 'Flight booked successfully!', unique_id: uniqueId });
    } finally {
        client.release();
    }
};

export const fetchBookingDetails = async (req: Request, res: Response): Promise<void> => {
    const searchValue = (req.query.identifier as string).replace(/\s+/g, '');
    const db = await initDB();
    const client = await db.connect();
    try {
        const result = await client.query('SELECT id,unique_id,fullname,contact_number,boarding_city,destination_city,departure_date::date,return_date::date,email_address FROM bookings WHERE contact_number = $1 OR unique_id = $2', [`+${searchValue}`,searchValue]);
        const booking = result.rows[0];
        if (!booking) {
            res.status(404).json({ message: 'Booking not found!' });
        } else {
            res.json(booking);
        }
    } finally {
        client.release();
    }
};

export const modifyBookingDetails = async (req: Request, res: Response): Promise<void> => {
    const { departure_date, return_date, boarding_city, destination_city, phone_number } = req.body;
  
    const db = await initDB();
    const client = await db.connect();
    try {
        await client.query(
            'UPDATE bookings SET departure_date = $1, return_date = $2, boarding_city = $3, destination_city = $4 WHERE contact_number = $5 or unique_id = $5',
            [departure_date, return_date, boarding_city, destination_city, phone_number]
        );
        res.json({ message: 'Booking updated successfully!' });
    } finally {
        client.release();
    }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const { phone_number } = req.body;
  
    const db = await initDB();
    const client = await db.connect();
    try {
        await client.query('DELETE FROM bookings WHERE contact_number = $1', [phone_number]);
        res.json({ message: 'Booking cancelled successfully!' });
    } finally {
        client.release();
    }
};