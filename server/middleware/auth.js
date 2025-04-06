const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Paimame token is Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Reikalinga autentifikacija" });
    }

    // Dekoduojame tokena
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ieskome vartotojo pagal ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Vartotojas nerastas" });
    }

    // Pridedame vartotoja prie request objekto
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Netesingas arba pasibaiges token" });
  }
};

module.exports = auth;
