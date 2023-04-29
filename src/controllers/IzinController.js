import express from 'express'
import Joi from 'joi'
import moment from 'moment'
import { Op } from 'sequelize'

import { msg } from '../utils/index.js'
import Izin from '../models/Izin.js'
import Karyawan from '../models/Karyawan.js'

const getAllIzin = async (req,res) => {
    const nik = req.user.nik

    const izin = await Izin.findAll({
        where: {
            nik_pengaju: nik
        },
        attributes: ['id', 'waktu_mulai', 'waktu_selesai', 'keterangan', 'status', 'jenis']
    })

    console.log(izin)

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
    
    
    const jenis = (izin.jenis==1) ? 'Cuti' : 'MCU'
    const status = 'Menunggu'
    if(izin.status==2){
        status = 'Disetujui'
    }
    else if(izin.status==3){
        status = 'Ditolak'
    }

    izin.dataValues.waktu_mulai = moment(izin.dataValues.waktu_mulai, 'YYYY-MM-DD').format('DD MMMM YYYY')
    izin.dataValues.waktu_selesai = moment(izin.dataValues.waktu_selesai, 'YYYY-MM-DD').format('DD MMMM YYYY')

    return res.status(200).send({
        izin: {
            id: izin.id,
            waktu_mulai: izin.waktu_mulai,
            waktu_selesai: izin.waktu_selesai,
            keterangan: izin.keterangan,
            status: status,
            jenis: jenis,
            pengganti: pengganti.nama,
            lokasi: izin.lokasi
        }
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
    let { waktu_mulai, waktu_selesai, keterangan, lokasi, pengganti, jenis } = req.body

    const schema = Joi.object({
        waktu_mulai: Joi.date().required().label('Tanggal Mulai').messages({
            'any.required': '{{#label}} harus diisi',
        }),
        waktu_selesai: Joi.date().required().label('Tanggal Selesai').messages({
            'any.required': '{{#label}} harus diisi',
        }),
        keterangan: Joi.string().required().label('Keterangan').messages({
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        lokasi: Joi.string().label('Lokasi').messages({

        }),
        pengganti: Joi.string().label('Pengganti').messages({

        }),
        jenis: Joi.number().required()
    })

    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr))
    }

    if(jenis==2 && !lokasi){
        return res.status(400).send(msg('Lokasi harus diisi'))
    }
    else if(jenis==1 && !pengganti){
        return res.status(400).send(msg('Pengganti harus diisi'))
    }

    if(!lokasi){
        lokasi = null
    }
    if(!pengganti){
        pengganti = null
    }

    // console.log(req.body)

    const izin = await Izin.create({
        nik_pengaju: nik,
        waktu_mulai,
        waktu_selesai,
        keterangan,
        lokasi,
        nik_pengganti: pengganti,
        status: 1,
        jenis
    })
    
    return res.status(201).send({
        message: 'Berhasil menambahkan izin',
        izin: izin
    })
}

export {
    getAllIzin, getDetailIzin, getKaryawanPengganti, addIzin
}