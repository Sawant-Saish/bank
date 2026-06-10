const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

/**
 * - create a new transaction
 * 10 Steps trasfer flow
 * 1. Validate request body
 * 2. vaidate idempotency key
 * 3. check if from account exists
 * 4. deriver sender balance from ledger
 * 5. create a new transaction with pending status
 * 6. create a debit entry in ledger for sender
 * 7. create a credit entry in ledger for receiver
 * 8. update transaction status to completed
 * 9. commit mongo transaction
 * 10. send email notification to sender and receiver
 */

async function createTransactionController(req, res) {
  /**
   * 1. Validate request body
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAmount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAmount });

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "From or To account not found",
    });
  }

  /**
   * 2. vaidate idempotency key
   */

  const istransactionExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (istransactionExists) {
    if (istransactionExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: istransactionExists,
      });
    }
    if (istransactionExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is pending",
      });
    }
    if (istransactionExists.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction failed",
      });
    }
    if (istransactionExists.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction reversed",
      });
    }
  }

  /**
   * 3. check if from account exists
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "both account should be active",
    });
  }
  /**
   * 4. deriver sender balance from ledger
   */

  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Your current balance is ${balance}`,
    });
  }

  /**
   * 5. create a new transaction with pending status
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  const newTransaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session }
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      type: "DEBIT",
      amount: amount,
      transaction: newTransaction._id,
    },
    { session }
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      type: "CREDIT",
      amount: amount,
      transaction: newTransaction._id,
    },
    { session }
  );

  newTransaction.status = "COMPLETED";
  await newTransaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  /**
   * 10. send email notification to sender and receiver
   */

  await emailService.sendTransactionEmail(
    req.user.email,
    req.useramount,
    fromAccount,
    toAccount
  );

  return res.status(200).json({
    message: "Transaction successful",
    transaction: newTransaction,
  });
}

module.exports = {
  createTransactionController,
};
