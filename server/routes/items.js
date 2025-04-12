const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const auth = require("../middleware/auth");

// Visus marsrutus apsaugoti autentifikacijos
router.use(auth);

// Gauti visus kuprines daiktus
router.get("/backpack/:backpackId", itemController.getItems);

// Gauti daikta pagal ID
router.get("/:id", itemController.getItem);

// Sukurti nauja daikta
router.post("/backpack/:backpackId", itemController.createItem);

// Atnaujinti daikta
router.put("/:id", itemController.updateItem);

// Istrinti daikta
router.delete("/:id", itemController.deleteItem);

module.exports = router;
