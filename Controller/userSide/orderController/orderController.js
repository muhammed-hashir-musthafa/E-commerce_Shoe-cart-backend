const Mongoose = require("mongoose");
const orderSchema = require("../../../Model/orderSchema/orderSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");
const cartSchema = require("../../../Model/cartSchema/cartSchema.js");
const userSchema = require("../../../Model/userSchema/userSchema.js");

// // Order products
// const orderItem = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { productId } = req.body;

//     if (!Mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ success: false, message: "No user found" });
//     }

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID is required",
//       });
//     }
//     const user = await userSchema.findById(userId);
//     const productExists = await productSchema.findById(productId);
//     if (!productExists) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     const cart = await cartSchema.findOne({ userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     const productInCart = cart.products.find(
//       (prodct) => prodct.productId.toString() === productId
//     );

//     if (!productInCart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found in cart" });
//     }

//     let order = await orderSchema.findOne({ userId });

//     if (!order) {
//       order = new orderSchema({
//         userId,
//         products: [{ productId, quantity: productInCart.quantity }],
//       });
//     } else {
//       const productIndex = order.products.findIndex(
//         (product) => product.productId.toString() === productId
//       );

//       if (productIndex !== -1) {
//         order.products[productIndex].quantity += productInCart.quantity;
//       } else {
//         order.products.push({ productId, quantity: productInCart.quantity });
//       }
//     }
//     user.order.push(order._id)
//     await user.save();
//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order successfully completed",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `Failed to order product: ${error.message}`,
//     });
//   }
// };

// Display orders
const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const orderList = await orderSchema
      .find({ userId })
      .populate("products.productId");

    if (!orderList) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order list fetched successfully",
      data: orderList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch order list: ${error.message}`,
    });
  }
};

// Request a refund
const requestRefund = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.isRefundRequested) {
      return res.status(400).json({ success: false, message: "Refund already requested" });
    }

     order.isRefundRequested = true;
    order.refundRequestedAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund request submitted",
      order,
    });
  } catch (err) {
    console.error("Error in requestRefund:", err);  
    return res.status(500).json({
      success: false,
      message: "Error submitting refund request",
      error: err.message,
    });
  }
};

// Process a refund
const processRefund = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

     if (order.refundStatus === "completed") {
      return res.status(400).json({ success: false, message: "Refund already processed" });
    }

    const paymentId = order.paymentInfo.paymentId;
    const amountInPaise = order.Total_Amount * 100;  

     const refund = await razorpay.payments.refund(paymentId, {
      amount: amountInPaise,
    });

     order.refundStatus = "completed";
    order.refundedAt = new Date();
    order.refundAmount = refund.amount / 100;   
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (err) {
    console.error("Error in processRefund:", err);   
    return res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: err.message,
    });
  }
};


module.exports = {/* orderItem*/ getOrders, requestRefund, processRefund };
