const orderSchema = require("../../../Model/orderSchema/orderSchema");

const totalRevenue = async (req, res) => {
  try {
    const orders = await orderSchema.find().populate("products.productId");

    if (!orders) {
      return res.status(400).json({ success: false, message: "No Sales yet!" });
    }

    const totalRevenue = orders
      .map((order) =>
        order.products.map((product) => {
          if (product.productId) return product.productId.price;
        })
      )
      .flat(Infinity)
      .reduce((a, b) => a + b, 0);

    console.log(totalRevenue);

    res.status(200).json({
      success: true,
      message: `Total revenue is ${totalRevenue}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};

const totalSales = async (req, res) => {
  try {
    const orders = await orderSchema.find().populate("products.productId");

    if (!orders) {
      return res.status(400).json({ success: false, message: "No Sales yet!" });
    }

    const totalSales = orders
      .map((order) => order.products.map((product) => product.quantity))
      .flat(Infinity)
      .reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      message: `Total product purchased is ${totalSales}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Bad request:${error.message}` });
  }
};

module.exports = { totalRevenue, totalSales };
