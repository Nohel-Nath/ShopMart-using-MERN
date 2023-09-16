const express = require("express");
const productDb = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");
const axios = require("axios");
const cloudinary = require("cloudinary");
const { promisify } = require("util");

//create-product//Admin
const createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await productDb.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 9;
  const productsCount = await productDb.countDocuments();
  const apiFeatures = new ApiFeatures(productDb.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeatures.query;
  const filteredProductsCount = products.length;

  res.status(201).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin)
const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const productsCount = await productDb.countDocuments();
  const products = await productDb.find();
  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await productDb.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

const searchProducts = catchAsyncErrors(async (req, res, next) => {
  /*const apiFeatures = new ApiFeatures(productDb.find(), req.query).search();
  const products = await apiFeatures.query;
  console.log(products);
  res.status(201).json({
    success: true,
    products,
  });*/
  const { name, category } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const products = await productDb.find(query);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//latest-products
const latestProducts = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productDb.find(), req.query);
  const products = await apiFeatures.filter2().query.exec();
  res.status(200).json({
    success: true,
    products,
  });
});

//hot-deals
const hotDeals = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productDb, req.query);
  const products = await apiFeatures.filter1().query.exec();
  res.status(200).json({
    success: true,
    products,
  });
});
//best-deals
const bestDeals = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productDb.find(), req.query);
  const products = await apiFeatures.filter3().query;
  res.status(200).json({
    success: true,
    products,
  });
});
//update-product//Admin
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productDb.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined && images.length > 0) {
    // Deleting Images From Cloudinary
    if (product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  } else {
    req.body.images = product.images;
  }

  product = await productDb.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productDb.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  await productDb.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productDb.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Product not found",
    });
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  try {
    //console.log(req.query.productId);
    //console.log(req);
    const productId = req.params.id;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid productId",
      });
    }
    // Check validity of the productId
    if (mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Valid ObjectId");
    } else {
      console.log("Invalid ObjectId");
    }
    const product = await productDb.findById(productId);
    //const product = await productDb.findOne({ productId: productId });
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    if (error.name === "CastError") {
      const message = `Resource not found. Invalid: ${error.path}`;
      error = new ErrorHandler(message, 404);
    }
    next(error); // Pass the error to the next error-handling middleware
  }
});

// Delete Review
const deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productDb.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  if (!reviews || reviews.length === 0) {
    return res.status(404).json({
      success: false,
      error: "Review not found",
    });
  }
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  //let ratings = 0;
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await productDb.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

const shareProductOnFacebook = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    // Get the product from the database
    const product = await productDb.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Assign the user field
    product.user = userId || req.user._id;

    // Share on Facebook logic
    const { facebookAccessToken } = req.body;

    // Make a POST request to the Facebook Graph API to share the product
    try {
      const response = await axios.post(
        `https://www.facebook.com/powerboy.nohel`,
        {
          message: `Check out this amazing product: ${product.name}`,
          link: `http://localhost:3005/products/${productId}`, // Replace with your actual product URL
          access_token: facebookAccessToken,
        }
      );

      // Check the response status to handle success/failure
      if (response.status === 200) {
        // Sharing on Facebook was successful
        product.sharedOn.push("facebook");
        await product.save();
        res
          .status(200)
          .json({ message: "Product shared successfully on Facebook" });
      } else {
        // Sharing on Facebook failed
        console.error(response.data.error.message);
        res
          .status(500)
          .json({ message: "Failed to share product on Facebook" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to share product on Facebook" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  searchProducts,
  updateProduct,
  deleteProduct,
  latestProducts,
  hotDeals,
  bestDeals,
  createProductReview,
  getProductReviews,
  deleteReviews,
  //shareProduct,
  shareProductOnFacebook,
  //shareProductOnTwitter,
};
