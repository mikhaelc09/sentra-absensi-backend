import express from 'express';
import {msg} from '../utils/index.js'
import Karyawan from '../models/Karyawan.js';
import authRoute from '../routes/auth.route.js';
import userRoute from './user.route.js';
import izinRoute from './izin.route.js';
import absensiRoute from './absensi.route.js';
import { resetPassword } from '../controllers/userController.js';

const router = express.Router();

router.get('/status', async (req, res) => {
    console.log(await Karyawan.findAll());
    return res.status(200).send(msg("status: OK"))
})

router.use('/auth', authRoute)

router.post('/reset-password', resetPassword)

router.use('/profile', userRoute)

router.use('/izin', izinRoute)

router.use('/absensi', absensiRoute)

export {router};