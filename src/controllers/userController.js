import express from 'express'
import Joi from 'joi'
import { Sequelize } from 'sequelize'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

import { msg } from '../utils/index.js'
import Karyawan from '../models/Karyawan.js'
import Divisi from '../models/Divisi.js'

const getUser = async (req,res) => {
    return res.status(200).send({
        user: {
            nik: req.user.nik,
            nama: req.user.nama,
            divisi: req.user.divisi
        }
    })
}

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
        oldpass: Joi.string().required().label('Password Lama').messages({
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        newpass: Joi.string().min(8).required().label('Password Baru').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        confpass: Joi.string().min(8).required().label('Konfirmasi Password').messages({
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
        return res.status(400).send(msg(validationErr.details[0].message.split('"').join('')))
    }

    const user = await Karyawan.findByPk(nik)

    const isPasswordValid = await bcrypt.compare(oldpass, user.password)
    if(!isPasswordValid){
        return res.status(400).send(msg("Password lama salah!"))
    }
    if(newpass !== confpass){
        return res.status(400).send(msg('Password dan konfirmasi password harus sama'))
    }

    const karyawan = await Karyawan.findByPk(nik)
    const hashedPass = bcrypt.hashSync(newpass, 12)
    await karyawan.update({
        password: hashedPass
    })
    return res.status(200).send(msg('Berhasil mengubah password'))
}

export {
    getUser, getKaryawan, changePassword
}