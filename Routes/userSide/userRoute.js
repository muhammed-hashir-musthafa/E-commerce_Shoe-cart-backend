const express = require("express");
const { login, signUp } = require("../../Controller/userSide/userController/userController.js");
// const { getProducts, getProductWithId, getProductWithCategory } = require("../../Controller/userSide/productController/productController.js");
// const { addToCart, getCart } = require("../../Controller/userSide/cartController/cartController.js");
// const { addToWishList, getWishList, deleteWishList } = require("../../Controller/userSide/wishListController/wishListController.js");
// const { getOrders, orderItem } = require("../../Controller/userSide/orderController/orderController.js");

const userRouter = express.Router();

userRouter.post("/register", signUp);
// userRouter.post("/login", login);
// userRouter.get("/products", getProducts);
// userRouter.get("/products/:id", getProductWithId);
// userRouter.get("/products/category/:icategoryname", getProductWithCategory);

// userRouter.post("/:id/cart", addToCart);

// userRouter.get("/:id/cart", getCart);

// userRouter.post("/:id/wishlists", addToWishList);

// userRouter.get("/:id/wishlists", getWishList);

// userRouter.delete("/:id/wishlists", deleteWishList);

// userRouter.get("/:id/orders", getOrders);

// userRouter.post("/:id/orders", orderItem);

module.exports = userRouter;
