import express from 'express'
import { checkToken } from '../utils/index.js'
import { getAllIzin, getDetailIzin, addIzin, getKaryawanPengganti } from '../controllers/IzinController.js'

const izinRoute = express.Router()

izinRoute.get('/', getAllIzin)
izinRoute.get('/:id_izin', checkToken, getDetailIzin)
izinRoute.get('/pengganti', checkToken, getKaryawanPengganti)
// izinRoute.post('/', checkToken, addIzin)
izinRoute.post('/', addIzin)

export default izinRoute