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
    // address: {
    //   type: String,
    //   required: true,
    // },
    // pincode: {
    //   type: Number,
    //   required: true,
    // },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wishlist",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
