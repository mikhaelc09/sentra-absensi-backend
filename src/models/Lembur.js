import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Lembur extends Model {}
Lembur.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tanggal:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      status:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Lembur',
      tableName: 'Lembur',
      underscored: true,
      timestamps:false
    }
);
export default Lembur;
