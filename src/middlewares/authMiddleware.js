const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    
    const token = req.cookies?.usertoken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password"); // ✅ should use findById, not findOne
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
