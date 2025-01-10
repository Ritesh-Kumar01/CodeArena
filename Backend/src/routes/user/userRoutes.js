import express from 'express';
import {registerUser, loginUser, getUserProfile, editUserProfile } from '../../controllers/user/userController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);


// Login route
router.post('/login', loginUser);

// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Edit user profile
router.put('/profile', authMiddleware, editUserProfile);

export default router;
