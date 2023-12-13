import express from 'express'
import Joi from 'joi'
import moment from 'moment'
import { Sequelize, Op } from 'sequelize'
import sequelize from '../config/database.js'

import { msg } from '../utils/index.js'
import Izin from '../models/Izin.js'
import Karyawan from '../models/Karyawan.js'

const getAllIzin = async (req,res) => {
    const nik = req.user.nik

    const izin = await Izin.findAll({
        where: {
            nik_pengaju: nik
        },
        attributes: ['id', 'waktu_mulai', 'waktu_selesai', 'keterangan', 'status', 'jenis'],
        order: [['waktu_mulai', 'DESC']]
    })

    izin.forEach((i) => {
        i.dataValues.waktu_mulai = moment(i.dataValues.waktu_mulai, 'YYYY-MM-DD').format('DD MMMM YYYY')
        i.dataValues.waktu_selesai = moment(i.dataValues.waktu_selesai, 'YYYY-MM-DD').format('DD MMMM YYYY')
    })

    return res.status(200).send({izin: izin})
}

const getDetailIzin = async (req,res) => {
    const id = req.params.id_izin

    const izin = await Izin.findByPk(id)
    let pengganti = null
    if(izin==null){
        return res.status(404).send(msg('Izin tidak ditemukan'))
    }

    if(izin.nik_pengganti!=null){
        pengganti = await Karyawan.findByPk(izin.nik_pengganti)
    }

    if(req.user.nik != izin.nik_pengaju){
        return res.status(401).send(msg('Unauthorized'))
    }
    
    
    let jenis = ''
    if(jenis==1) jenis = 'Cuti'
    else if(jenis==2) jenis = 'MCU'
    else if(jenis==3) jenis = 'Sakit'

    let status = ''
    if(izin.status==1) status = 'Menunggu'
    else if(izin.status==2) status = 'Disetujui'
    else if(izin.status==0) status = 'Ditolak'

    izin.dataValues.waktu_mulai = moment(izin.dataValues.waktu_mulai, 'YYYY-MM-DD').format('DD MMMM YYYY')
    izin.dataValues.waktu_selesai = moment(izin.dataValues.waktu_selesai, 'YYYY-MM-DD').format('DD MMMM YYYY')

    return res.status(200).send({
        izin: {
            id: izin.id,
            nik_pengaju: izin.nik_pengaju,
            waktu_mulai: izin.waktu_mulai,
            waktu_selesai: izin.waktu_selesai,
            keterangan: izin.keterangan!=null ? izin.keterangan : '',
            status: status,
            jenis: jenis,
            ttd: izin.signature,
            pengganti: pengganti!=null ? pengganti.nama : null,
            lokasi: izin.lokasi!=null ? izin.lokasi : null
        }
    })
}

const getSisaCuti = async (req,res) => {
    const nik = req.user.nik

    let sisa_cuti = 10

    const today = new Date()

    const izin = await Izin.findAll({
        where: {
            [Op.and]: [
                { nik_pengaju: nik },
                { jenis: 1 },
                sequelize.where(
                    sequelize.literal(`MONTH(created_at) = ${today.getMonth() + 1} AND YEAR(created_at) = ${today.getFullYear()}`),
                    true
                )
            ]
        },
    })

    if(izin.length>0){
        izin.forEach((i) => {
            const mulai = moment(i.waktu_mulai, 'YYYY-MM-DD')
            const selesai = moment(i.waktu_selesai, 'YYYY-MM-DD')
            const jmlh_hari = selesai.diff(mulai, 'days') + 1

            sisa_cuti -= jmlh_hari
        })
    }

    return res.status(200).send({
        sisa_cuti: sisa_cuti
    })
}

const getKaryawanPengganti = async (req,res) => {
    const id_divisi = req.user.divisi
    const nik = req.user.nik

    const karyawan = await Karyawan.findAll({
        where: {
            id_divisi: id_divisi,
            nik: {
                [Op.ne]: nik
            }
        },
        attributes: ['nik', 'nama']
    })

    return res.status(200).send({ karyawan: karyawan })
}

const addIzin = async (req,res) => {
    const nik = req.user.nik
    let { waktu_mulai, waktu_selesai, keterangan, lokasi, pengganti, jenis, ttd } = req.body

    const date = new Date()

    const schema = Joi.object({
        waktu_mulai: Joi.date().required().min(moment(date).format('YYYY-MM-DD')).label('Tanggal Mulai').messages({
            'any.required': '{{#label}} harus diisi',
            'date.min': '{{#label}} tidak valid'
        }),
        waktu_selesai: Joi.date().required().min(Joi.ref('waktu_mulai')).label('Tanggal Selesai').messages({
            'any.required': '{{#label}} harus diisi',
            'date.min': '{{#label}} tidak valid'
        }),
        keterangan: Joi.string().label('Keterangan'),
        lokasi: Joi.string().label('Lokasi'),
        pengganti: Joi.string().label('Pengganti'),
        jenis: Joi.number().required(),
        ttd: Joi.string().optional()
    })

    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr.details[0].message.split('"').join('')))
    }

    if(jenis==2 && !lokasi){
        return res.status(400).send(msg('Lokasi harus diisi'))
    }
    else if(jenis==1 && !pengganti){
        return res.status(400).send(msg('Pengganti harus diisi'))
    }
    else if((jenis==1 || jenis==3) && !keterangan){
        return res.status(400).send(msg('Keterangan harus diisi'))
    }

    if(!lokasi){
        lokasi = null
    }
    if(!pengganti || pengganti==0){
        pengganti = null
    }

    const izin = await Izin.create({
        nik_pengaju: nik,
        waktu_mulai,
        waktu_selesai,
        keterangan,
        lokasi,
        nik_pengganti: pengganti,
        status: 1,
        jenis,
        signature: ttd!=null ? ttd : ''
    })
    
    return res.status(201).send({
        message: 'Berhasil menambahkan izin',
        izin: izin
    })
}

export {
    getAllIzin, getDetailIzin, getSisaCuti, getKaryawanPengganti, addIzin
}