const razorpay = require("../../../config/razorpay.js");
const crypto = require("crypto");
const paymentSchema = require("../../../Model/paymentSchema/paymentSchema.js");
const Mongoose = require("mongoose");
const cartSchema = require("../../../Model/cartSchema/cartSchema.js");
const orderSchema = require("../../../Model/orderSchema/orderSchema.js");
const userSchema = require("../../../Model/userSchema/userSchema.js");

// Make payment
const createPayment = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currency, receipt } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const cart = await cartSchema
      .findOne({ userId })
      .populate("products.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart is Empty!" });
    }

    const amount = cart.products
      .map((item) => item.productId.price)
      .reduce((a, b) => a + b, 0);

    if (!currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: "Please provide currency, and receipt details.",
      });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Order creation failed" });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: "Payment order successfully created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to create payment order: ${error.message}`,
    });
  }
};

// Verify the payment
const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const userId = req.params.id;

    const cart = await cartSchema
      .findOne({ userId })
      .populate("products.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const amount = cart.products
      .map((item) => item.productId.price)
      .reduce((a, b) => a + b, 0);

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const user = await userSchema.findById(userId);

      const order = new orderSchema({
        userId,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        Total_Amount: amount,
        Payment_Id: razorpay_payment_id,
        Customer_Name: user.username,
        Total_Items: cart.products.length,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        contact: user.contact,
      });

      await order.save();

      await cartSchema.deleteMany({ userId });

      const payment = new paymentSchema({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: amount,
        currency: req.body.currency,
        status: "success",
      });

      await payment.save();

      res.status(200).json({
        success: true,
        message: "Payment verification successful and Ordered Successfully ",
        data: payment,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Payment verification failed: ${error.message}`,
    });
  }
};

module.exports = { createPayment, paymentVerification };
