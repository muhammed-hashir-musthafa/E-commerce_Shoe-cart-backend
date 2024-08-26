const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECREAT);
};

module.exports = generateToken;
