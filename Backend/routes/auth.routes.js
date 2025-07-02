import express from 'express';
import { register, login } from '../Controllers/auth.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/signup', upload.single('image'), register);
router.post('/login', login);

export default router;
