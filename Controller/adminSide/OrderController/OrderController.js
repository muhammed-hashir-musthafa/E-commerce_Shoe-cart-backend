const Mongoose = require("mongoose");
const orderSchema = require("../../../Model/orderSchema/orderSchema.js");

//Display all orders
const getAllOrders = async (req, res) => {
  try {
    const order = await orderSchema.find();

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "No order found" });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request: ${error.message}` });
  }
};

//Display orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "No user found" });
    }

    const orderByUser = await orderSchema.findOne({ userId });

    if (!orderByUser) {
      return res
        .status(400)
        .json({ success: false, message: "No order found" });
    }

    res.status(200).json({
      success: true,
      message: "orders fetched succesfully",
      data: orderByUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request: ${error.message}` });
  }
};

module.exports = { getAllOrders, getOrdersByUser };
