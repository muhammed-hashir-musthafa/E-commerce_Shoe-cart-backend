const cartSchema = require("../../../Model/cartSchema/cartSchema.js");

const addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

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
      data: cart.products,
      message: `product added to cart successfully `,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product : ${error.message}`,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.params.id;
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
const removeCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

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

module.exports = { addToCart, getCart, removeCart };
