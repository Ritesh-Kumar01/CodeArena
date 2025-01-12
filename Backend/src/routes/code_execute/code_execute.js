import express from 'express';

import { submitCode,executeCode } from '../../controllers/code_execute/code_executeController.js';  

import {authMiddleware} from "./../../middlewares/authMiddleware.js"


const router = express.Router();

// Route to handle code execution requests
router.post('/execute', executeCode);

router.post('/submit',authMiddleware ,submitCode);

export default router;

