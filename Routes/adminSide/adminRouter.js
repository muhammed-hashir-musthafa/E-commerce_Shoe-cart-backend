const express = require("express");
const { adminLogout, adminLogin } = require("../../Controller/adminSide/adminController/adminController.js");
const { getAllUsers, getUserById } = require("../../Controller/adminSide/UsersListController/UsersListController.js");
const { getProductWithIdByAdmin, getProductsByAdmin, addProduct, deleteProduct } = require("../../Controller/adminSide/productController/productController.js");
const { getAllOrders, getOrdersByUser } = require("../../Controller/adminSide/OrderController/OrderController.js");
 
const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);

adminRouter.get("/userlist", getAllUsers);
adminRouter.get("/:id/userlist", getUserById);

adminRouter.get("/products", getProductsByAdmin);
adminRouter.get("/products/:id", getProductWithIdByAdmin);
adminRouter.post("/product", addProduct);
adminRouter.delete("/:id/product", deleteProduct);
// adminRouter.patch("/product", updateProduct);

adminRouter.get("/orders", getAllOrders);
adminRouter.get("/:id/orders", getOrdersByUser);

// adminRouter.get("/products", totalSales);
// adminRouter.get("/products", totalRevenue);

module.exports = adminRouter;
