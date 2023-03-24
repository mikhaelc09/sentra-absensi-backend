import Absensi from "./Absensi.js";
import Divisi from "./Divisi.js";
import DPenggajian from "./DPenggajian.js";
import HPenggajian from "./HPenggajian.js";
import Izin from "./Izin.js";
import Jabatan from "./Jabatan.js";
import Jadwal from "./Jadwal.js";
import Karyawan from "./Karyawan.js";
import Lembur from "./Lembur.js";
import LokasiPenting from "./LokasiPenting.js";
import sequelize from "../config/database.js";

async function init(){
    //dilakukan pada
    LokasiPenting.hasMany(Jadwal, { foreignKey: 'id_lokasi' });
    Jadwal.belongsTo(LokasiPenting, { foreignKey: 'id_lokasi' });

    //mengikuti
    Divisi.hasMany(Jadwal, { foreignKey: 'id_divisi' });
    Jadwal.belongsTo(Divisi, { foreignKey: 'id_divisi' });

    //tergabung
    Divisi.hasMany(Karyawan, { foreignKey: 'id_divisi' });
    Karyawan.belongsTo(Divisi, { foreignKey: 'id_divisi' });
    
    //melakukan
    Karyawan.hasMany(Absensi, { foreignKey: 'nik' });
    Absensi.belongsTo(Karyawan, { foreignKey: 'nik' });

    //menambah
    Karyawan.hasMany(Lembur, { foreignKey: 'nik' });
    Lembur.belongsTo(Karyawan, { foreignKey: 'nik' });

    //menjabat
    Jabatan.hasMany(Karyawan, { foreignKey: 'id_jabatan' });
    Karyawan.belongsTo(Jabatan, { foreignKey: 'id_jabatan' });

    //mendapat
    Karyawan.hasMany(HPenggajian, { foreignKey: 'nik' });
    HPenggajian.belongsTo(Karyawan, { foreignKey: 'nik' });

    //terdiri atas
    HPenggajian.hasMany(DPenggajian, { foreignKey: 'id_header' });
    DPenggajian.belongsTo(HPenggajian, { foreignKey: 'id_header' });

    //mengajukan
    Karyawan.hasMany(Izin, { foreignKey: 'mengajukan_nik', as: 'mengajukan' });
    Izin.belongsTo(Karyawan, { foreignKey: 'mengajukan_nik', as: 'diajukan' });

    //menggantikan
    Karyawan.hasMany(Izin, { foreignKey: 'menggantikan', as: 'menggantikan' });
    Izin.belongsTo(Karyawan, { foreignKey: 'menggantikan', as: 'digantikan' });

    await sequelize.sync({ force: true });
}

export {init}