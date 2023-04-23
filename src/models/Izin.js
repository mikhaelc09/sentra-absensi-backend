import { Model, DataTypes, literal } from 'sequelize';
import sequelize from '../config/database.js';

class Izin extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.Karyawan, {foreignKey: 'nik_pengaju', as: 'pengaju'});
    this.belongsTo(models.Karyawan, {foreignKey: 'nik_pengganti', as: 'pengganti'});
  }
}
Izin.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nik_pengaju:{
        allowNull: false,
        type: DataTypes.STRING(10),
        // references: {model: 'karyawan', key: 'nik'}
      },
      nik_pengganti:{
        allowNull: true,
        type: DataTypes.STRING(10),
        // references: {model: 'karyawan', key: 'nik'}
      },
      waktu_mulai: {
        allowNull: false,
        type: DataTypes.DATEONLY
      },
      waktu_selesai: {
        allowNull: false,
        type: DataTypes.DATEONLY
      },
      keterangan: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      lokasi: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      status: {
        allowNull: false,
        type: DataTypes.SMALLINT
      },
      jenis: {
        allowNull: false,
        type: DataTypes.SMALLINT
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
      modelName: 'Izin',
      timestamps: true,
      paranoid: true,
      tableName: 'izin',
      underscored: true,
    }
);
export default Izin;
