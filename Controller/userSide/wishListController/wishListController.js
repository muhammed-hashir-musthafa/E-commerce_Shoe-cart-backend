const Mongoose = require("mongoose");
const wishSchema = require("../../../Model/wishListSchema/wishListSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");

// Add to wishlist
const addToWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const productExists = await productSchema.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let wishList = await wishSchema.findOne({ userId });

    if (!wishList) {
      wishList = new wishSchema({
        userId,
        products: [{ productId }],
      });
    } else {
      const existingProduct = wishList.products.find(
        (product) => product.productId.toString() === productId
      );

      if (existingProduct) {
        return res
          .status(400)
          .json({ success: false, message: "Product already exists" });
      }

      wishList.products.push({ productId });
    }

    await wishList.save();

    res.status(200).json({
      success: true,
      data: wishList.products,
      message: `product added to wishlist successfully `,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product : ${error.message}`,
    });
  }
};

// Dipslay wishlist
const getWishList = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const wishlist = await wishSchema
      .findOne({ userId })
      .populate("products.productId");

    if (!wishlist) {
      return res
        .status(400)
        .json({ success: false, message: "Wishlist not found" });
    }

    res.status(200).json({
      success: true,
      data: wishlist.products,
      message: "Wishlist fetched successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product : ${error.message}`,
    });
  }
};

// Delete wishlist
const deleteWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const productExists = await productSchema.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updatedWishList = await wishSchema.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    if (!updatedWishList) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedWishList,
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to delete product : ${error.message}`,
    });
  }
};

module.exports = { addToWishList, getWishList, deleteWishList };
