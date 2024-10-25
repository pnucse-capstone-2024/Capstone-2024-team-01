const Sequelize = require('sequelize');

module.exports = class Patient extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      people_idx: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      flair_image: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      flair_overlay: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      t1ce_image: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      t1ce_overlay: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      new_size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Patient',
      tableName: 'patients',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  
};