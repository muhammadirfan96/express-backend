const UsersModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Authentication = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
  });
  next();
};

module.exports = Authentication;
