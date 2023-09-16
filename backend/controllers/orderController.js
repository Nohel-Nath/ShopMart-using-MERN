const orderDb = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const productDb = require("../models/productModel");

const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderDb.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});
//users
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderDb
    .findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
//get Logged In User Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const userOrders = await orderDb.find({ user: req.user._id });
  const orderCount = await orderDb.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    userOrders,
    orders: orderCount,
  });
});

//getALlOrders-- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderDb.find();
  const ordersCount = await orderDb.countDocuments();

  /*const apiFeatures = new ApiFeatures(orderDb.find(), req.query).search1();
  const orders = await apiFeatures.query;
  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }*/

  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
    ordersCount,
  });
});

//update order status
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderDb.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await productDb.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderDb.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await orderDb.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Order Delete Successfully",
  });
});

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
