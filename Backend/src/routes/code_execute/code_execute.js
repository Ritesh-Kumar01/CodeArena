import express from 'express';

import { executeCode } from '../../controllers/code_execute/code_executeController.js';  

const router = express.Router();

// Route to handle code execution requests
router.post('/execute', executeCode);

export default router;

