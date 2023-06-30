import express from 'express'
import { checkToken } from '../utils/index.js'
import { getSlipGaji } from '../controllers/GajiController.js'

const gajiRoute = express.Router()

gajiRoute.get('/slip/:tahun/:bulan', checkToken, getSlipGaji)

export default gajiRoute