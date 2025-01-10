import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('CodeArena API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;