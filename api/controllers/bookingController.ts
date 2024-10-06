import { Request, Response } from 'express';
import { initDB } from '../database/sqlite';
import { Booking } from '../models/booking';

export const bookFlight = async (req: Request, res: Response): Promise<void> => {
    const { fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address }: Booking = req.body;
  
    const db = await initDB();
    await db.run(
      'INSERT INTO bookings (fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullname, contact_number, boarding_city, destination_city, departure_date, return_date, email_address]
    );
  
    res.status(201).json({ message: 'Flight booked successfully!' });
  };
  
  export const fetchBookingDetails = async (req: Request, res: Response): Promise<void> => {
    const phone_number = (req.query.phone_number as string).replace(/\s+/g, '');
    const db = await initDB();
    const booking = await db.get('SELECT * FROM bookings WHERE contact_number = ?', [`+${phone_number}`]);
  
    if (!booking) {
      res.status(404).json({ message: 'Booking not found!' });
    } else {
      res.json(booking);
    }
  };
  
  export const modifyBookingDetails = async (req: Request, res: Response): Promise<void> => {
    const { departure_date, return_date, boarding_city, destination_city, phone_number } = req.body;
  
    const db = await initDB();
    await db.run(
      'UPDATE bookings SET departure_date = ?, return_date = ?, boarding_city = ?, destination_city = ? WHERE contact_number = ?',
      [departure_date, return_date, boarding_city, destination_city, phone_number]
    );
  
    res.json({ message: 'Booking updated successfully!' });
  };
  
  export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const { phone_number } = req.body;
  
    const db = await initDB();
    await db.run('DELETE FROM bookings WHERE contact_number = ?', [phone_number]);
  
    res.json({ message: 'Booking cancelled successfully!' });
  };