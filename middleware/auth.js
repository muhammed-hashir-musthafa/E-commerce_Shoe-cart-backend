const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(400).json({ success: false, message: "Access denied " });
    }

    const tokenValidate = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!tokenValidate) {
      res.status(400).json({ success: false, message: "Token not valid" });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message} ` });
  }
};

module.exports = checkAuth;
