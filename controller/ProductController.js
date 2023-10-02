const { Op } = require("sequelize");
const ProductModel = require("../models/ProductModel");
const multer = require("multer");
const { storage, filefilter } = require("../config/Multer");
const { unlink, existsSync } = require("fs");
const { validationResult } = require("express-validator");
const upload = require("../config/Multer");

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
    res.json(response.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.createProduct = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = {
      name: req.body.name,
      price: req.body.price,
      photo: req.file.path,
    };
    console.log(data);
    ProductModel.create(data);
    res.status(201).json({ message: "data inserted" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    const upload = multer({ storage: storage }).single("photo");
    upload(req, res, (err) => {
      if (req.file.fieldname !== "photo") {
        // jgn validasi foto
        //
      }

      let data = {
        name: req.body.name,
        price: req.body.price,
      };

      if (req.file.fieldname === "photo") {
        data.photo = req.file.path;

        if (existsSync(response.photo))
          unlink(response.photo, (err) => {
            if (err)
              return res.status(500).json({ message: "failed to delete" });
          });
      }

      ProductModel.update(data, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "data updated" });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await ProductModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "no data found" });

    if (existsSync(response.photo))
      unlink(response.photo, (err) => {
        if (err) return res.status(500).json({ message: "failed to delete" });
      });

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
