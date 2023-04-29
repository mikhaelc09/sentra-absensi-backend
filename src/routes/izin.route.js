import express from 'express'
import { checkToken } from '../utils/index.js'
import { getAllIzin, getDetailIzin, addIzin, getKaryawanPengganti, getSisaCuti } from '../controllers/IzinController.js'

const izinRoute = express.Router()

izinRoute.get('/', checkToken, getAllIzin)
izinRoute.get('/sisa-cuti', checkToken, getSisaCuti)
izinRoute.get('/pengganti', checkToken, getKaryawanPengganti)
izinRoute.get('/:id_izin', checkToken, getDetailIzin)
izinRoute.post('/', checkToken, addIzin)

export default izinRoute