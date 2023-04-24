import express from 'express'
import Joi from 'joi'
import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'
dotenv.config()

import { msg } from '../utils/index.js'
import Karyawan from '../models/Karyawan.js'
import Divisi from '../models/Divisi.js'

const getKaryawan = async (req,res) => {
    const nik = req.user.nik

    const karyawan = await Karyawan.findByPk(nik, {
        attributes: [
            'nik', 'nama', 'email', 'alamat', 'no_telp', 'tanggal_lahir',
            [Sequelize.col('Divisi.nama'), 'divisi'],
        ],
        include: {
            model: Divisi,
            attributes: []
        }
    })
    return res.status(200).send({karyawan: karyawan})
}

const changePassword = async (req,res) => {
    const nik = req.user.nik
    const { oldpass, newpass, confpass } = req.body

    const schema = Joi.object({
        oldpass: Joi.string().min(8).required().label('Password Lama').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        newpass: Joi.string().min(8).required().label('Password Baru').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        confpass: Joi.string().min(8).required().equal(Joi.ref('newpass')).label('Konfirmasi Password').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
            'string.equal': '{{#label}} harus sama dengan password baru'
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr))
    }

    const karyawan = await Karyawan.findByPk(nik)
    karyawan.password = bcrypt.hashSync(newpass, 12)
    await karyawan.save()
    return res.status(200).send(msg('Berhasil mengubah password'))
}

const resetPassword = async (req,res) => {
    const nik = req.user.nik
    const { password, confpass } = req.body
    const schema = Joi.object({
        password: Joi.string().min(8).required().label('Password').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        confpass: Joi.string().min(8).required().equal(Joi.ref('pass')).label('Konfirmasi Password').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
            'string.equal': '{{#label}} harus sama dengan password baru'
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr))
    }

    const karyawan = await Karyawan.findByPk(nik)
    karyawan.password = bcrypt.hashSync(password, 12)
    await karyawan.save()
    return res.status(200).send(msg('Berhasil reset password'))
}

export {
    getKaryawan, changePassword, resetPassword
}