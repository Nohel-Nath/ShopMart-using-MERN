const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

const productController = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.createProduct
);
router.get("/allProducts", productController.getAllProducts);
router.get(
  "/adminProducts",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.getAdminProducts
);
router.get("/product/:id", productController.getProductDetails);

router.get("/allProducts/search", productController.searchProducts);
router.get("/allProducts/hot-deals", productController.hotDeals);
router.get("/allProducts/latest-products", productController.latestProducts);
router.get("/allProducts/best-deals", productController.bestDeals);
router.put(
  "/review",
  isAuthenticatedUser,
  productController.createProductReview
);
router.get("/reviews/:id", productController.getProductReviews);
router.delete(
  "/deleteReviews",
  isAuthenticatedUser,
  productController.deleteReviews
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.updateProduct
);
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  productController.deleteProduct
);
router.post(
  "/:productId/share/facebook",
  isAuthenticatedUser,
  productController.shareProductOnFacebook
);

module.exports = router;
