const razorpay = require("../../../config/razorpay.js");
const crypto = require("crypto");
const Payment = require("../../../Model/paymentSchema/paymentSchema.js");


// Make payment 
const createPayment = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: "Please provide amount, currency, and receipt details.",
      });
    }

    const options = {
      amount: amount * 100, // Convert to smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: "Order creation failed" });
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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

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
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: req.body.amount,
        currency: req.body.currency,
        status: "success",
      });

      await payment.save();

      res.status(200).json({
        success: true,
        message: "Payment verification successful",
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