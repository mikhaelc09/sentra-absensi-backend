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
            [Op.and]: [
                { karyawan: nik },
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
            [Op.and]: [
                { karyawan: nik },
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
    const { tahun, bulan } = req.params

    const absensi = Absensi.findAll({
        where: {
            [Op.and]: [
                { karyawan: nik },
                sequelize.where(sequelize.fn('EXTRACT(YEAR from "createdAt")'), '=', tahun),
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
            //INI BLM SLESAI
        })
    }
}

const addAbsensi = async (req,res) => {
    const nik = req.user.nik
    const { is_lembur, keterangan } = req.body

    let lat = null
    let long = null
    navigator.geolocation.getCurrentPosition((position)=>{
        lat = position.coords.latitude
        long = position.coords.longitude
        // console.log(position.timestamp)
        // console.log(position.coords.accuracy)
    })

    let status = 0
    //cek location valid gk
    if(lat!=null && long!=null){

    }

    const absensi = Absensi.create({
        karyawan: nik,
        longitude: long,
        latitude: lat,
        is_lembur: (is_lembur) ? is_lembur : null,
        keterangan: (keterangan) ? keterangan : null,
        status: status 
    })

    return res.status(201).send({
        data: absensi
    })
}

export {
    getJamKerja, getRiwayatHarian, getLaporanBulanan, addAbsensi
}