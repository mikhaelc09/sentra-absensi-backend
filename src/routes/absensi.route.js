import express from 'express'
import { checkToken } from '../utils'
import { getJamKerja, getRiwayatHarian, getLaporanBulanan, addAbsensi } from '../controllers/AbsensiController'

const absensiRoute = express.Router()

absensiRoute.get('/', checkToken, getJamKerja)
absensiRoute.get('/riwayat', checkToken, getRiwayatHarian)
absensiRoute.get('/laporan/:bulan', checkToken, getLaporanBulanan)

absensiRoute.post('/', checkToken, addAbsensi)

export default absensiRoute