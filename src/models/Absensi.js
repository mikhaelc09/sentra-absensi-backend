import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../config/database.js';

class Absensi extends Model {}
Absensi.init(
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
      longitude:{
        type: DataTypes.FLOAT,
        allowNull: false
      },
      latitude:{
        type: DataTypes.FLOAT,
        allowNull: false
      },
      is_lembur:{
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      keterangan:{
        type: DataTypes.STRING(100)
      },
      status:{
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      }
    },
    {
      sequelize,
      modelName: 'Absensi',
      tableName: 'Absensi',
      underscored: true,
      timestamps:false,
    }
);
export default Absensi;
