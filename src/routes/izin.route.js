import express from 'express'
import { checkToken } from '../utils/index.js'
import { getAllIzin, getDetailIzin, addIzin } from '../controllers/IzinController.js'

const izinRoute = express.Router()

izinRoute.get('/', getAllIzin)
izinRoute.get('/:id_izin', checkToken, getDetailIzin)
// izinRoute.post('/', checkToken, addIzin)
izinRoute.post('/', addIzin)

export default izinRoute