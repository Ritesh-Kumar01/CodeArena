import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js'; // Import MongoDB connection file
import userRouter from './routes/user/userRoutes.js';
import problemRouter from './routes/problems/problemsRoute.js';
import codeRouter from './routes/code_execute/code_execute.js';
import contestRouter from './routes/contests/contestRouter.js';
import submissionRoutes from './routes/code_execute/submissionRouter.js';
import contestParticipationRouter from "./routes/contests/contestParticipationRouter.js"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB();

// Routes
app.use('/api/user', userRouter); 
app.use('/api/problems', problemRouter); 
app.use('/api/code', codeRouter); 
app.use('/api/contests', contestRouter); 
app.use('/api/participation', contestParticipationRouter); 
app.use('/api/submissions', submissionRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
