import { msg, removeCookieIfExists, setCookie } from "../utils/index.js"
import Karyawan from "../models/Karyawan.js"
import Joi from "joi"

const login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email tidak valid",
            "any.required": "Email harus diisi",
            "string.empty": "Email harus diisi",
        }),
        password: Joi.string().min(8).required().messages({
            "string.min": "Password minimal 8 karakter",
            "any.required": "Password harus diisi",
            "string.empty": "Password harus diisi",
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(msg(validationErr))
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

    const token = jwt.sign({
        nik: user.nik,
        email: user.email,
        nama: user.nama,
        divisi: user.id_divisi
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    //save token to cookie
    removeCookieIfExists('token')
    setCookie('token', token, 1)

    return res.status(200).send({
        message: "Login berhasil",
        user: user.nama,
        token: token
    })
}

export {
    login
}