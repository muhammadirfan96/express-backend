const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Layanan email yang digunakan (misalnya, Gmail)
  auth: {
    user: "expressnodemailer72@gmail.com",
    pass: "ijixjulnfgmunlcl",
  },
  secure: true, // Gunakan TLS atau SSL (true untuk Gmail)
  port: 465, // Port email server (465 untuk Gmail dengan SSL)
  // Atau gunakan port 587 untuk TLS (pilih salah satu, sesuai dengan preferensi)
});

module.exports = transporter;
