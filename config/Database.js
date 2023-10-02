const sequelize = require("sequelize");

const db = new sequelize.Sequelize("server_express", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
