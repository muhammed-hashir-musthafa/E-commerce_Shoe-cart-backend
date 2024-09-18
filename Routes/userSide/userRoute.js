const express = require("express");
const {
  login,
  signUp,
  logout,
  updateInfo,
} = require("../../Controller/userSide/userController/userController.js");
const {
  getProducts,
  getProductWithId,
} = require("../../Controller/userSide/productController/productController.js");
const {
  addToCart,
  getCart,
  removeCart,
} = require("../../Controller/userSide/cartController/cartController.js");
const {
  addToWishList,
  getWishList,
  deleteWishList,
} = require("../../Controller/userSide/wishListController/wishListController.js");
const {
  getOrders,
  orderItem,
} = require("../../Controller/userSide/orderController/orderController.js");
const { checkAuth } = require("../../middleware/auth.js");
const {
  createPayment,
  paymentVerification,
} = require("../../Controller/userSide/paymentController/paymentController.js");
const {
  handleCart,
  cartController,
} = require("../../middleware/handleCart.js");

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.patch("/:id/updateinfo", updateInfo);

userRouter.get("/products", getProducts);
userRouter.get("/products/:id", getProductWithId);

userRouter.post("/:id/cart", checkAuth, handleCart, cartController);
userRouter.get("/:id/cart", checkAuth, getCart);
userRouter.delete("/:id/cart", checkAuth, removeCart);

userRouter.post("/:id/wishlists", checkAuth, addToWishList);
userRouter.get("/:id/wishlists", checkAuth, getWishList);
userRouter.delete("/:id/wishlists", checkAuth, deleteWishList);

// userRouter.post("/:id/orders", checkAuth, orderItem);
userRouter.get("/:id/orders", checkAuth, getOrders);
userRouter.post("/:id/payment-gateway", checkAuth, createPayment);
userRouter.post("/:id/payment-verification", checkAuth, paymentVerification);

module.exports = userRouter;
