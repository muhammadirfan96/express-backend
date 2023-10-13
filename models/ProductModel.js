const { DataTypes } = require("sequelize");
const db = require("../config/Database");

const ProductModel = db.define(
  "product",
  {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    photo: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = ProductModel;

// (async () => {
//   await db.sync();
// })();
