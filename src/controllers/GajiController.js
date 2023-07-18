import moment from 'moment'
import { Sequelize, Op } from 'sequelize'
import sequelize from '../config/database.js'

import { msg } from '../utils/index.js'
import Karyawan from '../models/Karyawan.js'
import HPenggajian from '../models/HPenggajian.js'
import DPenggajian from '../models/DPenggajian.js'

const getSlipGaji = async (req,res) => {
    const { tahun, bulan } = req.params
    const nik = req.user.nik 

    let nextBulan = parseInt(bulan)+1
    if(parseInt(bulan) == 12){
        nextBulan = 1
    }

    const hpenggajian = await HPenggajian.findOne({
        where: {
            nik: nik,
            tanggal: {
                [Op.and]: [
                  { [Op.gte]: new Date(`${tahun}-${bulan.toString().padStart(2,'0')}-01`) },
                  { [Op.lt]: new Date(`${tahun}-${nextBulan.toString().padStart(2,'0')}-01`) }
                ]
            }
        },
        attributes: [
            'id', 'nik', 'tanggal', 'total'
        ]
    })

    if(hpenggajian==null){
        return res.status(200).send({})
    }

    const dpenggajian = await DPenggajian.findAll({
        where: {
            id_header: hpenggajian.dataValues.id
        },
        attributes: [ 
            'id', 'id_header', 'judul', 'jumlah', 'nominal', 'subtotal'
        ]
    })

    if(dpenggajian==null){
        return res.status(200).send({})
    }

    let totalPenghasilan = 0
    let totalPotongan = 0

    const retHP = hpenggajian.dataValues
    const retDP = []

    dpenggajian.forEach(dp => {
        retDP.push(dp.dataValues)
        if(dp.nominal > 0){
            totalPenghasilan += dp.subtotal
        }
        else{
            totalPotongan += (dp.subtotal * -1)
        }
    })

    return res.status(200).send({
        gaji: {
            hpenggajian: retHP,
            dpenggajian: retDP
        },
        totalPenghasilan: totalPenghasilan,
        totalPotongan: totalPotongan
    })
}

export {
    getSlipGaji
}