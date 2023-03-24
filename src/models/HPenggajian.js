import { Model, DataTypes,literal } from 'sequelize';
import sequelize from '../config/database.js';

class HPenggajian extends Model {}
HPenggajian.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tanggal:{
        type: 'TIMESTAMP',
        defaultValue: literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      total:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'HPenggajian',
      underscored: true,
      timestamps:false
    }
);
export default HPenggajian;
