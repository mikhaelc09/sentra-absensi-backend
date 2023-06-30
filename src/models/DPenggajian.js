import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class DPenggajian extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.HPenggajian, {
      foreignKey: 'id_header',
    })
  }
}
DPenggajian.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_header:{
        allowNull: false,
        type: DataTypes.INTEGER,
        // references: {model: 'h_penggajian', key: 'id'}
      },
      judul: {
        allowNull: false,
        type: DataTypes.STRING(30)
      },
      keterangan: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      jumlah: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      nominal: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      subtotal: {
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
    modelName: 'DPenggajian',
    timestamps: true,
    paranoid: true,
    tableName: 'd_penggajian',
    underscored: true,
    }
);
export default DPenggajian;
