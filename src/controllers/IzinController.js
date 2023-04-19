import express from 'express'
import Joi from 'joi'

import { msg } from '../utils/index.js'
import Izin from '../models/Izin.js'

const getAllIzin = async (req,res) => {
    const nik = req.user.nik

    const izin = Izin.findAll({
        where: {
            karyawan: nik
        }
    })

    return res.status(200).send(izin)
}

const getDetailIzin = async (req,res) => {
    const id = req.params.id_izin

    const izin = Izin.findByPk(id)

    return res.status(200).send(izin)
}

const addIzin = async (req,res) => {
    const nik = req.user.nik
    let { tanggal_mulai, tanggal_selesai, keterangan, lokasi, pengganti, jenis } = req.body

    const schema = Joi.object({
        tanggal_mulai: Joi.date().required().label('Tanggal Mulai').messages({
            'any.required': '{{#label}} harus diisi',
        }),
        tanggal_selesai: Joi.date().required().label('Tanggal Selesai').messages({
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

    if(jenis==0 && !lokasi){
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

    const izin = await Izin.create({
        karyawan: nik,
        tanggal_mulai,
        tanggal_selesai,
        keterangan,
        lokasi,
        pengganti,
        status: 0,
        jenis
    })
    
    return res.status(201).send({
        message: 'Berhasil menambahkan izin',
        data: izin
    })
}

export {
    getAllIzin, getDetailIzin, addIzin
}