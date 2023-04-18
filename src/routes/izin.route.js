import express from 'express'
import { checkToken } from '../utils'
import { getAllIzin, getDetailIzin, addIzin } from '../controllers/IzinController'

const izinRoute = express.Router()

izinRoute.get('/', checkToken, getAllIzin)
izinRoute.get('/:id_izin', checkToken, getDetailIzin)
izinRoute.post('/', checkToken, addIzin)

export default izinRoute