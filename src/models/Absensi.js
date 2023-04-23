import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../config/database.js';

class Absensi extends Model {
  static associate(models) {
    this.belongsTo(models.Karyawan, {
      foreignKey: 'nik',
    })
  }
}
Absensi.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nik:{
        allowNull: false,
        type: DataTypes.STRING(10),
        // references: {model: 'karyawan', key: 'nik'}
      },
      longitude: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      latitude: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      is_lembur: {
        allowNull: false,
        type: DataTypes.SMALLINT
      },
      keterangan: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      status: {
        allowNull: false,
        type: DataTypes.SMALLINT,
        comment: '0: Invalid, 1: Valid'
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
      modelName: 'Absensi',
      timestamps: true,
      paranoid: true,
      tableName: 'absensi',
      underscored: true,
    }
);
export default Absensi;
