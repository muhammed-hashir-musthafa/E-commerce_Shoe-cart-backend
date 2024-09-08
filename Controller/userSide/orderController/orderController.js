const Mongoose = require("mongoose");
const orderSchema = require("../../../Model/orderSchema/orderSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");
const cartSchema = require("../../../Model/cartSchema/cartSchema.js");

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
      data: orderList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch order list: ${error.message}`,
    });
  }
};

module.exports = { /*orderItem,*/ getOrders };
