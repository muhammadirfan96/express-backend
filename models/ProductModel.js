const sequelize = require("sequelize");
const db = require("../config/Database");

const ProductModel = db.define(
  "product",
  {
    name: sequelize.DataTypes.STRING,
    price: sequelize.DataTypes.INTEGER,
    photo: sequelize.DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = ProductModel;

// (async () => {
//   await db.sync();
// })();
