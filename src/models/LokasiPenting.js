import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class LokasiPenting extends Model {
  static associate(models) {
    this.hasMany(models.Jadwal, {
      foreignKey: 'id_lokasi',
    });
  }
}
LokasiPenting.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING(255)
      },
      longitude: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      latitude: {
        allowNull: false,
        type: DataTypes.FLOAT
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
    modelName: 'LokasiPenting',
    timestamps: true,
    paranoid: true,
    tableName: 'lokasi_penting',
    underscored: true,
    }
);
export default LokasiPenting;
