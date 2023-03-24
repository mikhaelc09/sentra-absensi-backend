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
      waktu_mulai:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      waktu_selesai:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      keterangan:{
        type: DataTypes.TEXT,
        allowNull: false
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
      underscored: true,
      timestamps:false
    }
);
export default Izin;
