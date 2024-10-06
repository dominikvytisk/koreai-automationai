import express from 'express';
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
