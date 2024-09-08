const express = require("express");
const {
  adminLogout,
  adminLogin,
} = require("../../Controller/adminSide/adminController/adminController.js");
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../../Controller/adminSide/UsersListController/UsersListController.js");
const {
  getProductWithIdByAdmin,
  getProductsByAdmin,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../../Controller/adminSide/productController/productController.js");
const {
  getAllOrders,
  getOrdersByUser,
} = require("../../Controller/adminSide/OrderController/OrderController.js");
const {
  totalSales,
  totalRevenue,
} = require("../../Controller/adminSide/adminAnalytics/adminAnalytics.js");
const { checkAuth } = require("../../middleware/auth.js");

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);

adminRouter.get("/userlist" /*, checkAuth*/, getAllUsers);
adminRouter.get("/:id/userlist" /*, checkAuth*/, getUserById);
adminRouter.delete("/:id/deleteuser" /*, checkAuth*/, deleteUser);

adminRouter.get("/products" /*, checkAuth*/, getProductsByAdmin);
adminRouter.get("/products/:id" /*, checkAuth*/, getProductWithIdByAdmin);
adminRouter.post("/product" /*, checkAuth*/, addProduct);
adminRouter.delete("/:id/product" /*, checkAuth*/, deleteProduct);
adminRouter.patch("/:id/product" /*, checkAuth*/, updateProduct);

adminRouter.get("/orders" /*, checkAuth*/, getAllOrders);
adminRouter.get("/:id/orders" /*, checkAuth*/, getOrdersByUser);

adminRouter.get("/analytics-revenue" /*, checkAuth*/, totalRevenue);
adminRouter.get("/analytics-products" /*, checkAuth*/, totalSales);

module.exports = adminRouter;
