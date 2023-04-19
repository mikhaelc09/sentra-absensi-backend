import express from 'express'
import Joi from 'joi'
import moment from 'moment'

import { msg } from '../utils/index.js'
import Absensi from '../models/Absensi.js'

const getJamKerja = async (req,res) => {
    const nik = req.user.nik

    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

    const absensi = Absensi.findAll({
        where: {
            karyawan: nik,
            [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', today)
            ]
        },
        order: [['createdAt', 'ASC']],
    })

    let jamMasuk = (absensi.length == 0) ? null : absensi[0].createdAt
    jamMasuk = moment(jamMasuk).format('HH:mm')
    let jamKeluar = (absensi.length <= 1) ? null : absensi[absensi.length-1].createdAt
    jamKeluar = moment(jamKeluar).format('HH:mm')

    let jamKerja = null
    if(jamMasuk!=null && jamKeluar!=null){
        let hourDiff = jamMasuk.hours() - jamKeluar.hours()
        let minDiff = jamMasuk.minutes() - jamKeluar.minutes()
        if(minDiff > 60){
            hourDiff += 1
            minDiff -= 60
        }

        jamKerja = `${hourDiff}:${minDiff}`
    }
    
    return res.status(200).send({
        data: {
            jamMasuk: jamMasuk,
            jamKeluar: jamKeluar,
            jamKerja: jamKerja
        }
    })
}

const getRiwayatHarian = async (req,res) => {
    const nik = req.user.nik

    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

    const absensi = Absensi.findAll({
        where: {
            karyawan: nik,
            [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', today)
            ]
        },
        order: [['createdAt', 'ASC']],
    })

    if(absensi.length>0){
        absensi.forEach((absen) => {
            absen.createdAt = moment(absen.createdAt).format('HH:mm:ss')
        })
    }

    return res.status(200).send({
        data: absensi
    })
}

const getLaporanBulanan = async (req,res) => {
    const nik = req.user.nik
    const bulan = req.params.bulan

    const absensi = Absensi.findAll({
        where: {
            karyawan: nik,
            [Op.and]: [
                sequelize.where(sequelize.fn('EXTRACT(MONTH from "createdAt")'), '=', bulan)
            ]
        },
        order: [['createdAt', 'ASC']],
    })

    const retAbsensi = []
    let hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    if(absensi.length>0){
        absensi.forEach((absen) => {
            let tempTgl = moment(absen.createdAt).format('DD MMM YYYY')
            let tempHari = hari[moment(absen.createdAt).day()]
            let tanggal = `${tempHari}, ${tempTgl}`

            let jam = moment(absen.createdAt).format('HH:mm')
        })
    }
}

const addAbsensi = async (req,res) => {
    const nik = req.user.nik
}

export {
    getJamKerja, getRiwayatHarian, getLaporanBulanan, addAbsensi
}