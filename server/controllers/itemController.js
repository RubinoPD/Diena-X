const Item = require("../models/Item");
const Backpack = require("../models/Backpack");

// Gauti visus kuprines daiktus
exports.getItems = async (req, res) => {
  try {
    const { backpackId } = req.params;

    // Patikriname ar kuprine priklauso prisijungiams vartotojui
    const backpack = await Backpack.findOne({
      _id: backpackId,
      user: req.user._id,
    });

    if (!backpack) {
      return res.status(404).json({ message: "Kurpine nerasta" });
    }

    const items = await Item.find({ backpack: backpackId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Gauti daikta pagal ID
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("backpack");

    if (!item) {
      res.status(404).json({ message: "Daiktas nerastas" });
    }

    // Patikriname ar daikto kuprine priklauso prisijungusiam vartotojui
    if (item.backpack.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Neturite prieigos prie sio daikto" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Sukurti nauja daikta
exports.createItem = async (req, res) => {
  try {
    const { name, description, expiryDate, image } = req.body;
    const { backpackId } = req.params;

    // Patikriname ar kurpine priklauso prisijungusiam vartotojui
    const backpack = await Backpack.findOne({
      _id: backpackId,
      user: req.user._id,
    });

    if (!backpack) {
      return res.status(404).json({ message: "Kuprine nerasta" });
    }

    const item = new Item({
      name,
      description,
      expiryDate,
      image,
      backpack: backpackId,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Atnaujinti daikta
exports.updateItem = async (req, res) => {
  try {
    const { name, description, expiryDate, image } = req.body;

    const item = await Item.findById(req.params.id).populate("backpack");

    if (!item) {
      res.status(404).json({ message: "Daiktas nerastas" });
    }

    // Patikriname ar daikto kurpine priklauso prisijungusiam vartotojui
    if (item.backpack.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Neturite prieigos prie sio daikto" });
    }

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (expiryDate !== undefined) {
      item.expiryDate = expiryDate;
      item.reminderSent = {
        month: false,
        week: false,
        day: false,
        expired: false,
      };
    }

    if (image !== undefined) item.image = image;

    // item.name = name || item.name;
    // item.description = description || item.description;
    // item.expiryDate = expiryDate || item.expiryDate;
    // if (image) item.image = image;

    // // Atstatome priminimu statusa, jei data buvo pakeista
    // if (expiryDate) {
    //   item.reminderSent = {
    //     month: false,
    //     week: false,
    //     day: false,
    //     expired: false,
    //   };
    // }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Istrinti daikta
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("backpack");

    if (!item) {
      res.status(404).json({ message: "Daiktas nerastas" });
    }

    // Patikriname ar daikto kuprine priklauso prisijungusiam vartotojui
    if (item.backpack.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Neturite prieigos prie sio daikto" });
    }

    await item.deleteOne();
    res.json({ message: "Daiktas sekmingai istrintas" });
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};
