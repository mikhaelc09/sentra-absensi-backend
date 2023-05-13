import express from 'express'
import Joi from 'joi'
import moment from 'moment'
import axios from 'axios'
import { Sequelize, Op } from 'sequelize'
import sequelize from '../config/database.js'
import * as dotenv from 'dotenv'
dotenv.config()

import { msg } from '../utils/index.js'
import Absensi from '../models/Absensi.js'
import Jadwal from '../models/Jadwal.js'
import Lembur from '../models/Lembur.js'
import LokasiPenting from '../models/LokasiPenting.js'

const day = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS","JUMAT", "SABTU"]

const getOverview = async (req,res) => {
    const nik = req.user.nik

    const date = new Date()
    const today = date.toISOString().slice(0,10)

    const absensi = await Absensi.findAll({
        where: {
            nik,
            [Op.and]: [
                sequelize.where(
                    sequelize.literal(`DATE(created_at) = '${today}'`),
                    true
                )
            ],
        },
        order: [['created_at', 'ASC']],
    })
    
    let jamMasuk = (absensi.length == 0) ? null : absensi[0].created_at
    let jamKeluar = (absensi.length <= 1) ? null : absensi[absensi.length-1].created_at

    jamMasuk = jamMasuk!=null ? moment(jamMasuk) : '--:--'
    jamKeluar = jamKeluar!=null ? moment(jamKeluar) : '--:--'

    let jamKerja = null
    if(jamMasuk!='--:--' && jamKeluar!='--:--'){
        let hourDiff = jamKeluar.diff(jamMasuk, 'hours')
        let minDiff = jamKeluar.diff(jamMasuk, 'minutes')

        jamKerja = `${hourDiff}:${minDiff}`
    }

    if(jamMasuk!='--:--') jamMasuk = jamMasuk.format('HH:mm')
    if(jamKeluar!='--:--') jamKeluar = jamKeluar.format('HH:mm')

    const overview = {
        jamMasuk: jamMasuk,
        jamKeluar: jamKeluar,
        jamKerja: jamKerja!=null ? jamKerja : '--:--'
    }
    
    return res.status(200).send({
        overview
    })
}

const getRiwayatHarian = async (req,res) => {
    const nik = req.user.nik

    const date = new Date()
    const today = date.toISOString().slice(0,10)

    const absensi = await Absensi.findAll({
        where: {
            nik,
            [Op.and]: [
                sequelize.where(
                    sequelize.literal(`DATE(created_at) = '${today}'`),
                    true
                )
            ],
        },
        order: [['created_at', 'ASC']],
        attributes: [['created_at', 'jam'], 'status'] //kurang alamat + kota
    })

    let formattedAbsensi = []
    if(absensi.length>0){
        absensi.forEach((absen) => {
            formattedAbsensi.push({
                jam:moment(absen.dataValues.jam).format('HH:mm:ss'),
                status: absen.dataValues.status
            })
        })
    }

    return res.status(200).send({
        riwayat: formattedAbsensi
    })
}

const getLaporanBulanan = async (req,res) => {
    const nik = req.user.nik
    const { tahun, bulan } = req.params

    const absensi = await Absensi.findAll({
        where: {
            [Op.and]: [
                { karyawan: nik },
                sequelize.where(
                    sequelize.literal(`MONTH(created_at) = ${bulan} AND YEAR(created_at) = ${tahun}`),
                    true
                )
            ]
        },
        order: [['created_at', 'ASC']],
    })

    const retAbsensi = []
    let hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    if(absensi.length>0){
        absensi.forEach((absen) => {
            let tempTgl = moment(absen.dataValues.created_at).format('DD MMM YYYY')
            let tempHari = hari[moment(absen.dataValues.created_at).day()]
            let tanggal = `${tempHari}, ${tempTgl}`

            let jam = moment(absen.dataValues.created_at).format('HH:mm')
            //INI BLM SLESAI
        })
    }
}

const addAbsensi = async (req,res) => {
    const nik = req.user.nik
    // console.log(req.user);
    const { is_lembur, keterangan, coord } = req.body

    if(is_lembur && !keterangan){
        return res.status(400).send(msg('Mohon isi keterangan lembur'))
    }

    let status = 0
    //cek location valid gk
    let at = ''
    if(coord.lng!=null && coord.lat!=null){
        at = `${coord.lat},${coord.lng}`
    }
    console.log('Location:',at)
    const currentDay = day[(new Date()).getDay()]

    // get location name from jadwal
    const jadwal = await Jadwal.findOne({
        where: {
            nik: nik,
            hari: currentDay
        }
    })
    if(jadwal){
        const lokasi = await LokasiPenting.findByPk(jadwal.id_lokasi)
        const lokasiAbsen = await axios.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${at}&limit=10&lang=id&q=${lokasi.nama}&apiKey=${process.env.HERE_API_KEY}`)
        if(lokasiAbsen.data.items.length > 0){
            status = lokasiAbsen.data.items[0].distance < 2000
        }
    }

    // console.log(location.data)

    const absensi = await Absensi.create({
        nik: nik,
        longitude: coord.lng,
        latitude: coord.lat,
        is_lembur: (is_lembur) ? is_lembur : 0,
        keterangan: (keterangan) ? keterangan : '',
        status: status 
    })

    if(is_lembur){
        const lembur = await Lembur.create({
            nik: nik,
            status: 0
        })
    }

    return res.status(201).send({
        data: absensi
    })
}

export {
    getOverview, getRiwayatHarian, getLaporanBulanan, addAbsensi
}