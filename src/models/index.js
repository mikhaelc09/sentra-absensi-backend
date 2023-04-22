import Absensi from "./Absensi.js";
import Divisi from "./Divisi.js";
import DPenggajian from "./DPenggajian.js";
import HPenggajian from "./HPenggajian.js";
import Izin from "./Izin.js";
import Constant from "./Constant.js";
import Jadwal from "./Jadwal.js";
import Karyawan from "./Karyawan.js";
import Lembur from "./Lembur.js";
import LokasiPenting from "./LokasiPenting.js";
import sequelize from "../config/database.js";
import { Sequelize } from "sequelize";
const db = {}

async function init(){
    db.sequelize = sequelize
    db.Sequelize = Sequelize

    db.Absensi = Absensi
    db.Divisi = Divisi
    db.DPenggajian = DPenggajian
    db.HPenggajian = HPenggajian
    db.Izin = Izin
    db.Constant = Constant
    db.Jadwal = Jadwal
    db.Karyawan = Karyawan
    db.Lembur = Lembur
    db.LokasiPenting = LokasiPenting

    db.Absensi.associate(db)
    db.Divisi.associate(db)
    db.DPenggajian.associate(db)
    db.HPenggajian.associate(db)
    db.Izin.associate(db)
    db.Jadwal.associate(db)
    db.Karyawan.associate(db)
    db.Lembur.associate(db)
    db.LokasiPenting.associate(db)
}

export {init}