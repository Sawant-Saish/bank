const { Router } = require("../utils/route.utils");
const authMiddleware = require("../middleware/auth.middleware");

const transactionRouter = Router();

/**
 * @description create a new transaction
 * @route POST /api/transaction
 */

transactionRouter.post("/", authMiddleware.authMiddleware);

module.exports = transactionRouter;
