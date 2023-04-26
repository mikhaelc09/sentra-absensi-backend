import express from 'express';
import { checkResetToken, forgotPassword, login, logout, resetPassword } from '../controllers/AuthController.js';

const authRoute = express.Router()

authRoute.post('/login', login)
authRoute.post('/logout', logout)
authRoute.post('/forgot-password', forgotPassword)
authRoute.post('/reset-password', resetPassword)
authRoute.post('/check-reset-token', checkResetToken)

export default authRoute