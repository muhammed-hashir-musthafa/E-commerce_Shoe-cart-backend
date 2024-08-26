const orderSchema = require("../../../Model/orderSchema/orderSchema.js");

const orderItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    let order = await orderSchema.findOne({ userId });

    if (!order) {
      order = new orderSchema({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      order.products.push({ productId, quantity: 1 });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Successfully Completed",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to order product : ${error.message}`,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orderList = await orderSchema
      .findOne({ userId })
      .populate("products.productId");

    if (!orderList) {
      return res
        .status(400)
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
      message: `Failed to fetch order list : ${error.message}`,
    });
  }
};

module.exports = { orderItem, getOrders };
