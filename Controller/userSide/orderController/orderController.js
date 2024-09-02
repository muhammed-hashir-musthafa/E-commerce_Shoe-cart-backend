const Mongoose = require("mongoose");
const orderSchema = require("../../../Model/orderSchema/orderSchema.js");
const productSchema = require('../../../Model/productSchema/productSchema.js')

// Order products
const orderItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const productExists = await productSchema.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let order = await orderSchema.findOne({ userId });

    if (!order) {
      order = new orderSchema({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      const productIndex = order.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex !== -1) {
        order.products[productIndex].quantity += 1;
      } else {
        order.products.push({ productId, quantity: 1 });
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order successfully completed",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to order product: ${error.message}`,
    });
  }
};

// Display orders
const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const orderList = await orderSchema
      .findOne({ userId })
      .populate("products.productId");

    if (!orderList) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order list fetched successfully",
      data: orderList.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch order list: ${error.message}`,
    });
  }
};

module.exports = { orderItem, getOrders };
