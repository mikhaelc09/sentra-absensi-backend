import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../config/database.js';

class Izin extends Model {}
Izin.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      karyawan: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      tanggal_mulai:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      tanggal_selesai:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      keterangan:{
        type: DataTypes.TEXT,
        allowNull: false
      },
      lokasi: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      pengganti: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      status:{
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      jenis: {
        type: DataTypes.SMALLINT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Izin',
      tableName: 'Izin',
      underscored: true,
      timestamps:false
    }
);
export default Izin;
