import express from 'express';
import { bookFlight, fetchBookingDetails, modifyBookingDetails, cancelBooking } from '../controllers/bookingController';

const router = express.Router();

router.post('/bookflight', bookFlight);
router.get('/fetchbookingdetails', fetchBookingDetails);
router.patch('/modifybookingdetails', modifyBookingDetails);
router.delete('/cancelbooking', cancelBooking);

export default router;
