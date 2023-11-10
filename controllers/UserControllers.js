const UsersModel = require("../models/UsersModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const transporter = require("../config/Nodemailer");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const user = await UsersModel.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ message: "user not found" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(500).json({ message: "password wrong" });

    const payload = {
      uid: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });

    await UsersModel.update(
      { refreshToken: refreshToken },
      { where: { id: user.id } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: req.protocol == "https" ? true : false,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const data = {
      email: req.body.email,
      password: passwordHash,
      refreshToken: null,
      forgotPasswordToken: null,
    };

    await UsersModel.create(data);
    return res.status(201).json({ message: "new user created" });
  } catch (error) {
    console.log(error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await UsersModel.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!user) return res.sendStatus(403);

    jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);
    });

    const payload = {
      uid: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await UsersModel.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!user) return res.sendStatus(204);

    await UsersModel.update({ refreshToken: null }, { where: { id: user.id } });

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const forgotPasswordToken = req.cookies.forgotPasswordToken;
    if (!forgotPasswordToken) return res.sendStatus(401);

    const user = await UsersModel.findOne({
      where: { forgotPasswordToken: forgotPasswordToken },
    });
    if (!user) return res.sendStatus(403);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.newPassword, salt);

    jwt.verify(
      user.forgotPasswordToken,
      process.env.FORGOT_PASSWORD_TOKEN,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);

        if (parseInt(req.body.emailToken) !== decoded.emailToken)
          return res.status(500).json({ message: "invalid token" });

        await UsersModel.update(
          { password: passwordHash, forgotPasswordToken: null },
          { where: { email: decoded.email } }
        );
      }
    );
    res.clearCookie("forgotPasswordToken");
    return res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    // generate six digit number
    const min = 100000;
    const max = 999999;
    const randomDigit = Math.floor(Math.random() * (max - min + 1)) + min;

    // generate token
    const user = await UsersModel.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ message: "user not found" });

    const payload = {
      uid: user.id,
      email: user.email,
      emailToken: randomDigit,
    };

    const forgotPasswordToken = jwt.sign(
      payload,
      process.env.FORGOT_PASSWORD_TOKEN,
      { expiresIn: "120s" }
    );

    await UsersModel.update(
      { forgotPasswordToken: forgotPasswordToken },
      { where: { id: user.id } }
    );

    // buat cookie forgotPasswordToken
    res.cookie("forgotPasswordToken", forgotPasswordToken, {
      httpOnly: true,
      maxAge: 120 * 1000,
      secure: req.protocol == "https" ? true : false,
    });

    const mailOptions = {
      from: "expressnodemailer72@gmail.com",
      to: req.body.email ?? "muhammadirfan187@outlook.com",
      subject: "token reset password",
      text: `${randomDigit}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "fail sending token to email" });
      } else {
        console.log("success : " + info.response);
        return res
          .status(200)
          .json({ message: "success sending token to email" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.show = async (req, res) => {
  try {
    const response = await UsersModel.findOne({ where: { id: req.params.id } });
    if (!response) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.find = async (req, res) => {
  try {
    const email = req.query.email ?? "";
    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;
    const where = {
      email: {
        [Op.like]: `%${email}%`,
      },
    };
    const response = await UsersModel.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await UsersModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    await UsersModel.destroy({ where: { id: user.id } });
    return res.status(200).json({ message: "data deleted" });
  } catch (error) {
    console.log(error);
  }
};
