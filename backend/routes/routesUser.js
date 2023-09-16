const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

const userController = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/registration", userController.registerAUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.get(
  "/allUsers",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getAllUsers
);
router.get(
  "/details/:userId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.findUserById
);
router.post("/password-forgot", userController.forgetPassword);
router.put("/password-reset/:token", userController.resetPassword);
router.get("/details", isAuthenticatedUser, userController.getUserDetails);
router.put(
  "/passwordUpdate",
  isAuthenticatedUser,
  userController.updatePassword
);
router.put("/profileUpdate", isAuthenticatedUser, userController.updateProfile);
router.put(
  "/roleUpdate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.updateUserRole
);

router.delete(
  "/deleteAccount",
  isAuthenticatedUser,
  userController.deleteMyAccount
);

// Define the route to block/ban a user
router.put(
  "/:id/block",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.blockUser
);

router.get(
  "/blockList",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getBlockedList
);

router.put(
  "/:id/unblock",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.unblockUser
);

router.delete(
  "/userDelete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.deleteUser
);

module.exports = router;
