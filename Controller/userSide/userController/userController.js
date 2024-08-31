 const signUpValidation = require("../../../middleware/joiValidation/signUpValidationSchema.js");
const userSchema = require("../../../Model/userSchema/userSchema.js");
const { hashedPassword, comparePassword } = require("../../../utils/bcrypt.js");
const generateToken = require("../../../utils/jwt.js");

// Registration
const signUp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists..." });
    }

    const validatedUser = await signUpValidation.validateAsync({
      email,
      username,
      password,
    });

    const hashedPass = await hashedPassword(password);

    const newUser = new userSchema({
      email: validatedUser.email,
      username: validatedUser.username,
      password: hashedPass,
      role: role,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({
        success: false,
        message: `Bad request in validation: ${error.message}`,
      });
    }
    res.status(500).json({ message: `Bad request ${error.message}` });
  }
};

// login 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found. Please create an account ",
      });
    }

    const validUser = comparePassword(password, user.password);

    if (!validUser) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password/username" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      username: user.username,
      password: user.password,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

// logout
const logout = (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message} ` });
  }
};

module.exports = { signUp, login, logout };
