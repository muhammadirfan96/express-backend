const express = require("express");
const db = require("./config/Database");
const cors = require("cors");
const path = require("path");
const port = 5000;
const ProductRoutes = require("./routes/ProductRoutes");
const UserRoutes = require("./routes/UserRoutes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(ProductRoutes);
app.use(UserRoutes);
app.use("/uploads-img", express.static(path.join(__dirname, "uploads-img")));

db.authenticate()
  .then(() => console.log("Koneksi ke database berhasil..."))
  .catch((err) => console.error("Koneksi ke database gagal:", err));

app.listen(port, () => console.log(`server running on port ${port}...`));
