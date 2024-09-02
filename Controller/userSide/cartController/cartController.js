const Mongoose = require("mongoose");
const cartSchema = require("../../../Model/cartSchema/cartSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");

//Add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const product = await productSchema.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await cartSchema.findOne({ userId });

    if (!cart) {
      cart = new cartSchema({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (product) => product.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: `product added to cart successfully `,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product : ${error.message}`,
    });
  }
};

//Display cart
const getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const cart = await cartSchema
      .findOne({ userId })
      .populate("products.productId");

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      data: cart,
      message: "cart fetched successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `cart fetching failed : ${error.message}`,
    });
  }
};

// Remove from cart
const removeCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const cart = await cartSchema.findOne({ userId });

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart not found " });
    }

    const productExists = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productExists === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    const updatedCart = await cartSchema.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedCart,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `cart removing failed : ${error.message}`,
    });
  }
};

// Quantity increment of product
const quantityIncrement = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const cart = await cartSchema.findOne({ userId });

    const productExists = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productExists === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    const product = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (product >= 0) {
      cart.products[product].quantity += quantity;
    }

    await cart.save();

    res.json({
      success: true,
      message: "Product quantity increased successfully",
      data: cart,
    });
  } catch (error) {
    res
      .status(200)
      .json({ success: false, message: `Bad requset : ${error.message}` });
  }
};

// Quantity decrement of product
const quantityDecrement = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const cart = await cartSchema.findOne({ userId });

    const productExists = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productExists === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const product = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (product >= 0) {
      cart.products[product].quantity -= quantity;
    }

    if (cart.products[product].quantity < 1) {
      cart.products[product].quantity = 1;
    }

    await cart.save();

    res.json({
      success: true,
      message: "Product quantity decreased successfully",
      data: cart,
    });
  } catch (error) {
    res
      .status(200)
      .json({ success: false, message: `Bad requset : ${error.message}` });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeCart,
  quantityIncrement,
  quantityDecrement,
};
