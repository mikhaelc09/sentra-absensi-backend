import express from 'express'
import { checkToken } from '../utils/index.js'
import { getOverview, getRiwayatHarian, getLaporanBulanan, getLaporanChart, addAbsensi } from '../controllers/AbsensiController.js'

const absensiRoute = express.Router()

absensiRoute.get('/overview', checkToken, getOverview)
absensiRoute.get('/riwayat', checkToken, getRiwayatHarian)
absensiRoute.get('/laporan/periode', checkToken, getLaporanBulanan)
absensiRoute.get('/laporan/:tahun/:bulan', checkToken, getLaporanChart)

absensiRoute.post('/', checkToken, addAbsensi)

export default absensiRoute