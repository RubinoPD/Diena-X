// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Diena X API veikia!");
});

// Prisijungimas prie duomenų bazės
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Prisijungta prie MongoDB"))
  .catch((err) => console.error("Klaida prisijungiant prie MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Serveris paleistas portu: ${PORT}`);
});
