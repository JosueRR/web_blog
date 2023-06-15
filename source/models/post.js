'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.Accounts, {
        foreignKey: 'accountId',
        onDelete: 'CASCADE'
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        onDelete: 'CASCADE'
      });
      Post.belongsToMany(models.Tag, {
        through: models.Post_tag,
      });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    accountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};