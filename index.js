import express from 'express';
import cors from 'cors';
import router from './routes/route.js';

import cookieParser from 'cookie-parser'; 
import { connectToMongo } from './database/connectMongo.js'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 your frontend URL
    credentials: true, // 👈 allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// connection to mongoDB
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Our API!');
});

// Import and use the router
app.use("/api/", router);

// await sendOtp('+919877511146'); // Replace with a valid phone number

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});


export default app;