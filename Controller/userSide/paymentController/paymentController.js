const razorpay = require("../../../config/razorpay.js");

const createPayment = async (req, res) => {
  try {
    // const userId= req.params.id
    const { amount, currency, receipt } = req.body;

    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: "Please provide amount, currency, and receipt details.",
      });
    }
    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ success: false, message: "Order failed" });
    }

    res
      .status(200)
      .json({ success: true, data: order, message: "Successfully ordered " });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

module.exports = createPayment;
