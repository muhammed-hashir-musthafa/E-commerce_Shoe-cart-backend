const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
    },
    imageAlt: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
