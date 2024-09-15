const Mongoose = require("mongoose");
const wishSchema = require("../../../Model/wishListSchema/wishListSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");
const userSchema = require("../../../Model/userSchema/userSchema.js");

// Add to wishlist
const addToWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const productExists = await productSchema.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let wishList = await wishSchema.findOne({ userId });

    if (!wishList) {
      wishList = new wishSchema({
        userId,
        products: [{ productId }],
      });
      user.wishlist = wishList._id;
    } else {
      const existingProduct = wishList.products.some(product => product.productId.toString() === productId);

      if (existingProduct) {
        return res.status(400).json({ success: false, message: "Product already in wishlist" });
      }

      wishList.products.push({ productId });
    }
    
    await wishList.save();
    await user.save();

    res.status(200).json({
      success: true,
      data: wishList.products,
      message: "Product added to wishlist successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product: ${error.message}`,
    });
  }
};

// Display wishlist
const getWishList = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const wishlist = await wishSchema.findOne({ userId }).populate("products.productId");

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    res.status(200).json({
      success: true,
      data: wishlist.products,
      message: "Wishlist fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch wishlist: ${error.message}`,
    });
  }
};

// Remove from wishlist
const deleteWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const productExists = await productSchema.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const wishlist = await wishSchema.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex(product => product.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in wishlist" });
    }

    wishlist.products.splice(productIndex, 1);

    if (wishlist.products.length > 0) {
      await wishlist.save();
    } else {
      await wishSchema.deleteOne({ _id: wishlist._id });
      user.wishlist = undefined;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: wishlist.products,
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to remove product: ${error.message}`,
    });
  }
};

module.exports = { addToWishList, getWishList, deleteWishList };
