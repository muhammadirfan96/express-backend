const { Op } = require("sequelize");
const ProductModel = require("../models/ProductModel");
const { unlink, existsSync } = require("fs");
const { validationResult } = require("express-validator");
const upload = require("../config/Multer");
const multer = require("multer");

exports.show = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.find = async (req, res) => {
  try {
    const name = req.query.name ?? "";
    const price = req.query.price ?? "";
    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;
    const where = {
      name: {
        [Op.like]: `%${name}%`,
      },
      price: {
        [Op.like]: `%${price}%`,
      },
    };
    const response = await ProductModel.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = {
      name: req.body.name,
      price: req.body.price,
    };

    await ProductModel.create(data);
    res.status(201).json({ message: "data inserted" });
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    let data = {
      name: req.body.name,
      price: req.body.price,
    };

    await ProductModel.update(data, { where: { id: req.params.id } });
    res.status(200).json({ message: "data updated" });
  } catch (error) {
    console.log(error);
  }
};

exports.remove = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    if (existsSync(response.photo)) unlink(response.photo, () => null);

    await ProductModel.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "data deleted" });
  } catch (error) {
    console.log(error);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    upload.single("photo")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "max size is 1 MB" });
      } else if (err) {
        return res.status(500).json({ message: "just receive a valid image" });
      }

      if (existsSync(response.photo)) unlink(response.photo, () => null);

      ProductModel.update(
        { photo: req.file.path },
        { where: { id: req.params.id } }
      );
      res.status(200).json({ message: "photo updated" });
    });
  } catch (error) {
    console.log(error);
  }
};
