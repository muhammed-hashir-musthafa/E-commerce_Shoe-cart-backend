const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
  return (generatedPassword = bcrypt.hash(password, 10));
};

const comparePassword = (password, newPassword) => {
  return (comparedPassword = bcrypt.compare(password, newPassword));
};

module.exports = { hashedPassword, comparePassword };
