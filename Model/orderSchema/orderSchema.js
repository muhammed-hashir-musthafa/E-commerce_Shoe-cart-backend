const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    purchaseDate: {
      type: Date,
    },
    totalPrice: {
      type: Number,
    },
    totalItems: {
      type: Number,
    },
    CustomerName: {
      type: String,
    },
    DeliveryAddress: {
      type: String,
    },
    DeliveryPincode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);
