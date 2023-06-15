'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //One is user is assct. with many posts
      Accounts.hasMany(models.Post, {
        foreignKey: 'accountId',
      });
    }
  }
  Accounts.init({
    username: DataTypes.STRING(50),
    password: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    isAdmin: DataTypes.BOOLEAN,
    isRegistered: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Accounts',
  });
  return Accounts;
};