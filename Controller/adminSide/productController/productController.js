const  Mongoose  = require("mongoose");
const productValidation = require("../../../middleware/joiValidation/productValidation.js");
const productSchema = require("../../../Model/productSchema/productSchema.js");

const getProductsByAdmin = async (req, res) => {
  try {
    //  Display all products

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

const getProductWithIdByAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
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

const addProduct = async (req, res) => {
  try {
    const { title, price, category } = req.body;
    const validatedProduct = await productValidation.validateAsync(req.body);

    const existingProduct = await productSchema.findOne({ title });

    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product already exists...." });
    }

    const newProduct = new productSchema(validatedProduct);

    await newProduct.save();

    res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({
        success: false,
        message: `validation error ${error.message} `,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: `Bad request:${error.message}` });
    }
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    
    if (!Mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "No product found" });
    }

    const deleteProduct = await productSchema.findByIdAndDelete(productId);

    if (!deleteProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Product deleted successfully",
        data: deleteProduct,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};
const updateProduct = async (req, res) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};

module.exports = {
  getProductsByAdmin,
  getProductWithIdByAdmin,
  addProduct,
  deleteProduct,
  updateProduct,
};
