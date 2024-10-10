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
        const fieldsToUpdate = [];
        const values = [];
        let index = 1;

        if (departure_date !== undefined && departure_date !== '') {
            fieldsToUpdate.push(`departure_date = $${index++}`);
            values.push(departure_date);
        }
        if (return_date !== undefined && return_date !== '') {
            fieldsToUpdate.push(`return_date = $${index++}`);
            values.push(return_date);
        }
        if (boarding_city !== undefined && boarding_city !== '') {
            fieldsToUpdate.push(`boarding_city = $${index++}`);
            values.push(boarding_city);
        }
        if (destination_city !== undefined && destination_city !== '') {
            fieldsToUpdate.push(`destination_city = $${index++}`);
            values.push(destination_city);
        }

        if (fieldsToUpdate.length === 0) {
            res.status(400).json({ message: 'No fields to update' });
            return;
        }
        values.push(phone_number);
        const query = `UPDATE bookings SET ${fieldsToUpdate.join(', ')} WHERE contact_number = $${index} or unique_id = $${index}`;
        await client.query(query, values);
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
        await client.query('DELETE FROM bookings WHERE contact_number = $1 or unique_id = $1', [phone_number]);
        res.json({ message: 'Booking cancelled successfully!' });
    } finally {
        client.release();
    }
};