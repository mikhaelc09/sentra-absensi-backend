import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class DPenggajian extends Model {}
DPenggajian.init(
    {
      id_lokasi:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      judul:{
        type: DataTypes.STRING(50),
        allowNull: false
      },
      keterangan:{
        type: DataTypes.TEXT
      },
      jumlah:{
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'DPenggajian',
      underscored: true,
      timestamps:false
    }
);
export default DPenggajian;
