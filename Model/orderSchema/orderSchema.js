const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    isRefundRequested: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    refundAmount: { type: Number, default: 0 },
    refundRequestedAt: { type: Date },
    refundedAt: { type: Date },
    Total_Amount: {
      type: Number,
    },
    Payment_Id: {
      type: String,
    },
    order_Id: {
      type: String,
    },
    Total_Items: { type: Number },
    Customer_Name: { type: String },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    contact: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
