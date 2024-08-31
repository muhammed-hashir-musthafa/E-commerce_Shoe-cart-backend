const userSchema = require("../../../Model/userSchema/userSchema");
const { comparePassword } = require("../../../utils/bcrypt");
const generateToken = require("../../../utils/jwt");

// Admin login 
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await userSchema.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User. Create an account" });
    }

    const validUser = comparePassword(password, admin.password);

    if (!validUser) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password/username" });
    }

    if (admin.role === "admin") {
      const token = generateToken(admin.id);

     return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        username: admin.username,
        password: admin.password,
        token,
      });
    }else{
        res.status(400).json({success:false,message:"Access Denied: You are not an admin"})
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request: ${error.message}` });
  }
};

// Admin logout
const adminLogout = (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Admin logged out" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad requset: ${error.message}` });
  }
};

module.exports = { adminLogin, adminLogout };
