import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class LokasiPenting extends Model {}
LokasiPenting.init(
    {
      id_lokasi:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
      long:{
        type: DataTypes.FLOAT,
        allowNull: false
      },
      lat:{
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'LokasiPenting',
      underscored: true,
      timestamps:false
    }
);
export default LokasiPenting;
