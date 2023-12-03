const jwt = require("jsonwebtoken");
const config = require("../config/auth");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenData = token.substring(7);

  try {
    const decoded = jwt.verify(tokenData, config.secret);

    req.userData = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
