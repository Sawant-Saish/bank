const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * @description create a new account
 * @route POST /api/account
 */

router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController
);

module.exports = router;
