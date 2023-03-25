import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Jadwal extends Model {}
Jadwal.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      hari:{
        type: DataTypes.STRING(10),
        allowNull: false
      },
      jam_kerja:{
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Jadwal',
      tableName: 'Jadwal',
      underscored: true,
      timestamps:false
    }
);
export default Jadwal;
