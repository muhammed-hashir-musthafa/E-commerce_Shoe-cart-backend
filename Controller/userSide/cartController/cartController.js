const cartSchema = require("../../../Model/cartSchema/cartSchema.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");
const userSchema = require("../../../Model/userSchema/userSchema.js");
const mongoose = require("mongoose");

//Add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = await userSchema.findById(userId);
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
      user.cart = cart._id;
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
    // user.cart.push(cart._id);
    await user.save();
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const cart = await cartSchema.findOne({ userId });
    const user = await userSchema.findById(userId);

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

    cart.products.splice(productExists, 1);

    if (cart.products.length === 0) {
      await userSchema.findByIdAndUpdate(userId, {
        $unset: { cart: "" },
      });
      await cartSchema.deleteOne({ _id: cart._id });
    } else {
      await cart.save();
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: cart,
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
      cart.products[product].quantity += 1;
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
      cart.products[product].quantity -= 1;
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
