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
      waktu:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
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
      }
    },
    {
      sequelize,
      modelName: 'Absensi',
      underscored: true,
      timestamps:false
    }
);
export default Absensi;
