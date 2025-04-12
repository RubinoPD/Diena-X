const Backpack = require("../models/Backpack");
const Item = require("../models/Item");

// Gauti visas kuprines
exports.getBackpacks = async (req, res) => {
  try {
    const backpacks = await Backpack.find({ user: req.user._id });
    res.json(backpacks);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Gauti kuprine pagal ID
exports.Backpack = async (req, res) => {
  try {
    const backpack = await Backpack.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!backpack) {
      return res.status(404).json({ message: "Kuprine nerasta" });
    }

    res.json(backpack);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Sukurti nauja kuprine
exports.createBackpack = async (req, res) => {
  try {
    const { name, description } = req.body;

    const backpack = new Backpack({
      name,
      description,
      user: req.user._id,
    });

    await backpack.save();
    res.status(201).json(backpack);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Atnaujinti kuprine
exports.updateBackpack = async (req, res) => {
  try {
    const { name, description } = req.body;

    const backpack = await Backpack.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        name,
        description,
      },
      { new: true }
    );

    if (!backpack) {
      res.status(404).json({ message: "Kuprine nerasta" });
    }
    res.json(backpack);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Istrinti kuprine
exports.deleteBackpack = async (req, res) => {
  try {
    const backpack = await Backpack.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!backpack) {
      return res.status(404).json({ message: "Kuprine nerasta" });
    }

    // Istriname visus kuprines daiktus
    await Item.deleteMany({ backpack: req.params.id });

    res.json({ message: "Kuprine sekmingai istrinta" });
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};
