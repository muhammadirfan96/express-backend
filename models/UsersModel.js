const { DataTypes } = require("sequelize");
const db = require("../config/Database");

const UsersModel = db.define(
  "users",
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    forgotPasswordToken: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = UsersModel;

// (async () => {
//   await db.sync();
// })();
