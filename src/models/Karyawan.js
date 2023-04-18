import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Karyawan extends Model {}
Karyawan.init(
    {
      nik:{
        type: DataTypes.STRING(10),
        primaryKey: true,
        autoIncrement: false
      },
      nama:{
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email:{
        type: DataTypes.STRING(50),
        allowNull: false
      },
      password:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
      alamat:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      tanggal_lahir:{
        type: DataTypes.DATE,
        allowNull: false
      },
      no_telp:{
        type: DataTypes.STRING(15),
        allowNull: false
      },
      status:{
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      keterangan:{
        type: DataTypes.TEXT,
      },
      is_admin: {
        type: DataTypes.SMALLINT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Karyawan',
      tableName: 'Karyawan',
      underscored: true,
      timestamps:false
    }
);
export default Karyawan;
