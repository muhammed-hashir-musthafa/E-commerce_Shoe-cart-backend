const Order = require("../../../Model/orderSchema/orderSchema.js");

const orderItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let order = await Order.findOne({ userId });

    if (!order) {
      order = new Order({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      const productIndex = order.products.findIndex(
        (p) => p.productId.toString() === productId
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

const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orderList = await Order.findOne({ userId }).populate(
      "products.productId"
    );

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
