import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Constant extends Model {}
Constant.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      type: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: '1: string, 2: integer, 3: float'
      },
      stringvalue: {
        type: DataTypes.STRING(30),
      },
      intvalue: {
        type: DataTypes.INTEGER
      },
      floatvalue: {
        type: DataTypes.FLOAT
      },
      shortdesc: {
        type: DataTypes.STRING(50)
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'Constant',
      timestamps: true,
      paranoid: true,
      tableName: 'constants',
      underscored: true,
    }
);
export default Constant;
