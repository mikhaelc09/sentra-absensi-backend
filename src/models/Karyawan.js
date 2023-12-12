import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Karyawan extends Model {
  static associate(models) {
    this.belongsTo(models.Divisi, {
      foreignKey: 'id_divisi',
    });
    this.hasMany(models.Jadwal, {
      foreignKey: 'nik',
    })
    this.hasMany(models.Lembur, {
      foreignKey: 'nik',
    })
    this.hasMany(models.Absensi, {
      foreignKey: 'nik',
    })
    this.hasMany(models.Izin, {
      foreignKey: 'nik_pengaju',
      as: 'pengaju'
    })
    this.hasMany(models.Izin, {
      foreignKey: 'nik_pengganti',
      as: 'pengganti'
    })
    this.hasMany(models.HPenggajian, {
      foreignKey: 'nik',
    })
  }
}
Karyawan.init(
    {
      nik: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.STRING(10)
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255)
      },
      no_telp: {
        allowNull: true,
        type: DataTypes.STRING(15)
      },
      no_rekening: {
        allowNull: false,
        type: DataTypes.STRING(15)
      },
      nama_rekening: {
        allowNull: false,
        type: DataTypes.STRING(50)
      },
      id_divisi: {
        allownull: false,
        references:{
          model:'divisi',
          key:'id'
        },
        type: DataTypes.INTEGER,
        // references: {model: 'divisi', key: 'id'}
      },
      status: {
        allowNull: false,
        type: DataTypes.SMALLINT
      },
      keterangan: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      is_admin: {
        allowNull: false,
        type: DataTypes.SMALLINT
      },
      gaji_pokok: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      tunjangan_perusahaan: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at:{
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'Karyawan',
      timestamps: true,
      paranoid: true,
      tableName: 'karyawan',
      underscored: true,
    }
);
export default Karyawan;
