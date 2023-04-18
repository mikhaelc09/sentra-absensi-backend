import express from 'express';
import Karyawan from '../models/Karyawan.js';
import authRoute from '../routes/auth.route.js';
import {msg} from '../utils/index.js'

const router = express.Router();

router.get('/status', async (req, res) => {
    console.log(await Karyawan.findAll());
    return res.status(200).send(msg("status: OK"))
})

router.use('/auth', authRoute)

export {router};