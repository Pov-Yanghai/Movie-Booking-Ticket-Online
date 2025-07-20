import express from 'express';
import { createMessage, getAllMessages } from '../Controllers/message.controller.js';


const router = express.Router();
router.post('/', createMessage);
// Route for admin to get all messages
export default router;