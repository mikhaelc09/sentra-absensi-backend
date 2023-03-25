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
      longitude:{
        type: DataTypes.FLOAT,
        allowNull: false
      },
      latitude:{
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'LokasiPenting',
      tableName: 'LokasiPenting',
      underscored: true,
      timestamps:false
    }
);
export default LokasiPenting;
