const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Account is required"],
    ref: "Account",
    index: true,
    immutable: true, // Once set, the account reference cannot be changed
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Transaction is required"],
    ref: "Transaction",
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      message: "Type must be either 'DEBIT' or 'CREDIT'",
    },
    required: [true, "Type is required"],
    immutable: true,
  },
});

function preventLedgerModification(next) {
  throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndRemove", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("update", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

const ledgerModel = mongoose.model("Ledger", ledgerSchema);

module.exports = ledgerModel;
