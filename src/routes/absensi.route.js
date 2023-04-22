import express from 'express'
import { checkToken } from '../utils/index.js'
import { getJamKerja, getRiwayatHarian, getLaporanBulanan, addAbsensi } from '../controllers/AbsensiController.js'

const absensiRoute = express.Router()

absensiRoute.get('/', checkToken, getJamKerja)
absensiRoute.get('/riwayat', checkToken, getRiwayatHarian)
absensiRoute.get('/laporan/:tahun/:bulan', checkToken, getLaporanBulanan)

absensiRoute.post('/', checkToken, addAbsensi)

export default absensiRoute