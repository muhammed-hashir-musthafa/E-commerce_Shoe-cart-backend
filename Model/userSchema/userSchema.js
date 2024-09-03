const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    profileThumbImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    CreatedOn: {
      type: Date,
    },
    role: {
      type: String,
      default: "user",
    },
    address: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    }],
    order: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    }],
    wishList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "wishlists",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
