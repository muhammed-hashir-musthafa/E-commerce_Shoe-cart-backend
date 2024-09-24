const jwt = require("jsonwebtoken");
const userSchema = require("../Model/userSchema/userSchema.js");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Access denied" });
    }

    const tokenValidate = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!tokenValidate) {
      return res
        .status(400)
        .json({ success: false, message: "Token not valid" });
    }

    // const user = await userSchema.findById(tokenValidate.id);

    // if (!user) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "User not found." });
    // }
    // req.user = user;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message} ` });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role || !req.user !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

module.exports = { checkAuth, adminAuth };
