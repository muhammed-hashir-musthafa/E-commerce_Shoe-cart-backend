const wishSchema = require("../../../Model/wishListSchema/wishListSchema.js");

const addToWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

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

const getWishList = async (req, res) => {
  try {
    const userId = req.params.id;
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

const deleteWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
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
