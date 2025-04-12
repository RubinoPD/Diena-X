const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Registracija
router.post("/register", authController.register);

// Prisijungimas
router.post("/login", authController.login);

// Gauti vartotojo informacija
router.get("/me", auth, authController.getMe);

module.exports = router;
