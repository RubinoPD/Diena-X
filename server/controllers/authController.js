const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Sugeneruoti JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Registruoti nauja vartotoja
exports.register = async (req, res) => {
  try {
    const [username, email, password] = req.body;

    // Tikrinam ar varototjas jau egzistuoja
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(400).json({
        message:
          "Vartotojas su tokiu el. pastu arba prisijungimo vardu jau egzistuoja",
      });
    }

    // Sukuriame nauja vartotoja
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generuojam tokena
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("KLAIDA REGISTRUOJANT VARTOTOJĄ:", error);
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Prisijungimas
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Randame vartotoja
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Neteisingas el. pastas arba slaptazodis" });
    }

    // Tikriname slaptazodi
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Neteisingas el.pastas arba slaptazodis" });
    }

    // Generuojame tokena
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};

// Gauti prisijungusio vartotojo informacija
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida", error: error.message });
  }
};
