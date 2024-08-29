const {
  addToCart,
  quantityDecrement,
  quantityIncrement,
} = require("../Controller/userSide/cartController/cartController.js");

const handleCart = (req, res, next) => {
  try {
    const { action } = req.body;

    if (action === "increment") {
      req.controller = quantityIncrement;
    } else if (action === "decrement") {
      req.controller = quantityDecrement;
    } else {
      req.controller = addToCart;
    }
    next();
  } catch (error) {
    res
      .send(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

const cartController = (req,res,next) => {
  try {
    req.controller(req,res,next)
    // next()
  } catch (error) {
    res
      .send(500)
      .json({ success: false, message: `Bad request ${error.message}` });
  }
};

module.exports = { handleCart, cartController };
