const express = require("express");
const router = express.Router();
const backpackController = require("../controllers/backpackController");
const auth = require("../middleware/auth");

// Visu marsrututu apsaugoti autentifikacija
router.use(auth);

// Gauti visas kuprines
router.get("/", backpackController.getBackpacks);

// Gauti kuprine pagal ID
router.get("/:id", backpackController.getBackpack);

// Sukurti nauja kuprine
router.post("/", backpackController.createBackpack);

// Atnaujinti kuprine
router.put("/:id", backpackController.updateBackpack);

// Istrinti kuprine
router.delete("/:id", backpackController.deleteBackpack);

module.exports = router;
