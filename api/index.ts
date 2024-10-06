import express, { Request, Response } from 'express';
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.send("Express on Vercel");
  });
app.use('/api', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
