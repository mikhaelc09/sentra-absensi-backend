import express from 'express';
import { login, logout } from '../controllers/AuthController.js';

const authRoute = express.Router()

authRoute.post('/login', login)
authRoute.post('/logout', logout)

export default authRoute