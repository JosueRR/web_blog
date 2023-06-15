'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalAdress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalAdress.init({
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    telefonoCasa: DataTypes.STRING,
    direccionCasa: DataTypes.STRING,
    telefonoTrabajo: DataTypes.STRING,
    direccionTrabajo: DataTypes.STRING,
    correo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonalAdress',
  });
  return PersonalAdress;
};