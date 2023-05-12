import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Jadwal extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.Karyawan, { foreignKey: 'nik' });
    this.belongsTo(models.LokasiPenting, { foreignKey: 'id_lokasi' });
  }
}
Jadwal.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nik: {
        allowNull: false,
        type: DataTypes.STRING(10),
        // references: {model: 'karyawan', key: 'nik'},
      },
      id_lokasi: {
        allowNull: false,
        type: DataTypes.INTEGER,
        // references: {model: 'lokasi_penting', key: 'id'}
      },
      hari: {
        allowNull: false,
        type: DataTypes.STRING(10)
      },
      jam_kerja: {
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
      modelName: 'Jadwal',
      timestamps: true,
      paranoid: true,
      tableName: 'jadwal',
      underscored: true,
    }
);
export default Jadwal;
