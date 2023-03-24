import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Divisi extends Model {}
Divisi.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama:{
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Divisi',
      underscored: true,
      timestamps:false
    }
);
export default Divisi;
