import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Lembur extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.Karyawan, {
      foreignKey: 'nik',
    })
  }
}
Lembur.init(
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
      tanggal: {
        allowNull: false,
        type: DataTypes.DATE
      },
      status: {
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
      modelName: 'Lembur',
      timestamps: true,
      paranoid: true,
      tableName: 'lembur',
      underscored: true,
    }
);
export default Lembur;
