'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    imageFile: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // User hasMany logs
    User.hasMany(models.Log, { onDelete: 'cascade' });
  };
  return User;
};