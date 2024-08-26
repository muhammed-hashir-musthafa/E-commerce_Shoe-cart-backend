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
