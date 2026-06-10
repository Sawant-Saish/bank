const { Router } = require("../utils/route.utils");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");

const transactionRouter = Router();

/**
 * @description create a new transaction
 * @route POST /api/transaction
 */

transactionRouter.post(
  "/system/initial-funds",
  authMiddleware.authSystemMiddleware,
  transactionController.createTransaction
);

module.exports = transactionRouter;
