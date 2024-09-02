const Mongoose = require("mongoose");
const productSchema = require("../../../Model/productSchema/productSchema.js");

//  Display all products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let getProducts;

    if (category) {
      getProducts = await productSchema.find({ category });

      if (getProducts.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }
    } else {
      getProducts = await productSchema.find();
    }
    res.status(200).json({
      success: true,
      data: getProducts,
      message: "products fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

//  Display products by Id
const getProductWithId = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!Mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "No product found" });
    }

    const getProductId = await productSchema.findById(productId);

    if (!getProductId) {
      return res.status(400).json({
        success: false,
        message: `product not available  ${productId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: getProductId,
      message: `product fetched by Id successfully`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

module.exports = { getProducts, getProductWithId };
