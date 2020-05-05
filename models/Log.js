'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    location: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {});
  Log.associate = function(models) {
    // Log belongsTo User
    Log.belongsTo(models.User, { foreinKey: 'UserId' });
  };
  return Log;
};