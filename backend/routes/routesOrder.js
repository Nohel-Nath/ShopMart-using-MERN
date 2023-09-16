const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

const orderController = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/new", isAuthenticatedUser, orderController.newOrder);
router.get("/me", isAuthenticatedUser, orderController.myOrders);
router.get("/:id", isAuthenticatedUser, orderController.getSingleOrder);
router.get(
  "/admin/all",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.getAllOrders
);
router.put(
  "/admin/updateOrder/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.updateOrder
);
router.delete(
  "/admin/deleteOrder/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  orderController.deleteOrder
);

module.exports = router;
