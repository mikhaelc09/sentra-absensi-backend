import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

import { msg } from "../utils/index.js"
import { getLocalStorage } from "../utils/LocalStorage.js";
import Karyawan from "../models/Karyawan.js"
import Joi from "joi"
import Divisi from "../models/Divisi.js"
let localStorage = getLocalStorage()

const login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email tidak valid",
            "any.required": "Email harus diisi",
            "string.empty": "Email harus diisi",
        }),
        password: Joi.string().required().messages({
            "any.required": "Password harus diisi",
            "string.empty": "Password harus diisi",
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr.details[0].message.split('"').join('')))
    }
    const { email, password } = req.body
    const user = await Karyawan.findOne({
        where:{
            email: email,
        }
    })
    if(!user){
        return res.status(404).send(msg("Email tidak terdaftar!"))
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).send(msg("Password salah!"))
    }

    const divisi = await Divisi.findByPk(user.id_divisi)

    const token = jwt.sign({
        nik: user.nik,
        email: user.email,
        nama: user.nama,
        divisi: user.id_divisi
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    //save token to cookie
    res.cookie("token", token, {
        httpOnly: false,
        expires: DateTime.now().plus({ hours: 1 }).toJSDate(),
    })

    //save token to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('nik', user.nik)

    return res.status(200).send({
        message: "Login berhasil",
        user: {
            nik: user.nik,
            nama: user.nama,
            divisi: divisi.nama
        },
        token: token
    })
}

const logout = async (req,res) => {
    res.clearCookie("token")
    localStorage.removeItem('token')
    localStorage.removeItem('nik')
    return res.status(200).send(msg("Logout berhasil"))
}

const forgotPassword = async (req,res) => {
    const { email } = req.body
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email tidak valid",
            "any.required": "Email harus diisi",
            "string.empty": "Email harus diisi",
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr.details[0].message.split('"').join('')))
    }

    const user = await Karyawan.findOne({
        where:{
            email: email,
        }
    })
    if(!user){
        return res.status(404).send(msg('Email tersebut tidak terdaftar'))
    }

    const token = jwt.sign({
        nik: user.nik,
        email: user.email,
        nama: user.nama
    }, process.env.JWT_SECRET, {
        expiresIn: '10m'
    })

    //send email
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD
        }
    })

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./src/views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./src/views/'),
    }

    transporter.use('compile', hbs(handlebarOptions))

    var mailOptions = {
        from: `"Absensi Sentra Medika Surabaya" <${process.env.EMAIL}>`, // sender address
        to: user.email, // list of receivers
        subject: 'Reset Password Absensi Sentra Medika Surabaya',
        template: 'email', // the name of the template file i.e email.handlebars
        context:{
            name: user.nama,
            action_url: `http://localhost:5173/check-token?token=${token}`
        }
    }
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
            return res.status(200).send(msg('Email reset password berhasil dikirim'))
        }
    })
}

const checkResetToken = async (req,res) => {
    let token = req.body.token
    if (!token) {
        return res.status(401).send('Unauthorized')
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        return res.status(200).send({
            message: 'Token valid',
            nik: user.nik
        })
    } catch (err) {
        return res.status(400).send('Invalid API Key')
    }
}

const resetPassword = async (req,res) => {
    const { nik, password, confpass } = req.body
    const schema = Joi.object({
        nik: Joi.string().required(),
        password: Joi.string().min(8).required().label('Password').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        }),
        confpass: Joi.string().min(8).required().label('Konfirmasi Password').messages({
            'string.min': '{{#label}} minimal 8 karakter',
            'any.required': '{{#label}} harus diisi',
            'string.empty': '{{#label}} harus diisi',
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr.details[0].message.split('"').join('')))
    }

    if(password !== confpass){
        return res.status(400).send(msg('Password dan konfirmasi password harus sama'))
    }

    const karyawan = await Karyawan.findByPk(nik)
    const hashedPass = bcrypt.hashSync(password, 12)
    await karyawan.update({
        password: hashedPass
    })
    return res.status(200).send(msg('Berhasil reset password'))
}

export {
    login, logout, forgotPassword, resetPassword, checkResetToken
}