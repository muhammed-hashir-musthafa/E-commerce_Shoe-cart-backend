const mongoose = require("mongoose");
const userSchema = require("../../../Model/userSchema/userSchema");

// Display all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request: ${error.message}` });
  }
};

// Display users by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const userById = await userSchema.findById(userId);

    if (!userById) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: userById,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User not  found" });
    }

    const deleteUser = await userSchema.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleteUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};

module.exports = { getAllUsers, getUserById, deleteUser };
