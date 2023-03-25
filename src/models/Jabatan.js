import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Jabatan extends Model {}
Jabatan.init(
    {
      id_jabatan:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama:{
        type: DataTypes.STRING(30),
        allowNull: false
      },
      tunjangan:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Jabatan',
      tableName: 'Jabatan',
      underscored: true,
      timestamps:false
    }
);
export default Jabatan;
