const { Op } = require("sequelize");
const ProductModel = require("../models/ProductModel");
const { unlink, existsSync } = require("fs");
const { validationResult } = require("express-validator");
const upload = require("../config/Multer");
const multer = require("multer");

exports.showProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.findProduct = async (req, res) => {
  try {
    let where = null;
    if (req.params.key.includes("@")) {
      const field = req.params.key.split("@")[0];
      const value = req.params.key.split("@")[1];
      if (field == "name") {
        where = {
          name: {
            [Op.like]: `%${value}%`,
          },
        };
      }
      if (field == "price") {
        where = {
          price: {
            [Op.like]: `%${value}%`,
          },
        };
      }
    }
    const response = await ProductModel.findAndCountAll({
      where: where,
      limit: parseInt(req.params.limit),
      offset: parseInt(req.params.offset),
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

exports.createProduct = async (req, res) => {
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

exports.updateProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    let data = {
      name: req.body.name,
      price: req.body.price,
    };

    await ProductModel.update(data, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "data updated" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    if (existsSync(response.photo)) unlink(response.photo, () => null);

    await ProductModel.destroy({
      where: {
        id: req.params.id,
      },
    });
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
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ message: "photo updated" });
    });
  } catch (error) {
    console.log(error);
  }
};
