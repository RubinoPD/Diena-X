// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Importuojam marsrutus
const authRoutes = require("./routes/auth");
const backpackRoutes = require("./routes/backpacks");
const itemRoutes = require("./routes/items");

// Importuojam priminimu servisa
const reminderService = require("./services/reminderService");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Padidinam limita del galimu nuotrauku
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/backpacks", backpackRoutes);
app.use("/api/items", itemRoutes);

// Main route
app.get("/", (req, res) => {
  res.send("Diena X API veikia!");
});

// Prisijungimas prie duomenų bazės
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Prisijungta prie MongoDB");

    // Pradedame serverį
    app.listen(PORT, () => {
      console.log(`Serveris paleistas portu: ${PORT}`);

      // Nustatome priminimų sistemą
      reminderService.scheduleReminderChecks();
    });
  })
  .catch((err) => console.error("Klaida prisijungiant prie MongoDB:", err));

// Klaidu tvarkytojas
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Kazkas negerai!");
});
