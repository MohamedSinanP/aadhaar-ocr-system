import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import router from './routes/route';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', router);

// // Global error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // Handle timeout error explicitly
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   if (err.code === 'ETIMEDOUT') {
//     res.status(503).json({ message: 'Request timeout. Please try again.' });
//   } else {
//     next(err);
//   }
// });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
