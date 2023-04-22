import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Divisi extends Model {
  static associate(models) {
    this.hasMany(models.Karyawan, {
      foreignKey: 'id_divisi',
    });
  }
}
Divisi.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tunjangan: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at:{
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'Divisi',
      timestamps: true,
      paranoid: true,
      tableName: 'divisi',
      underscored: true,
    }
);
export default Divisi;
