const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      unique: true,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be either 'ACTIVE' or 'FROZEN' or 'CLOSED'",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
  },

  { timestamps: true }
);

accountSchema.index({ user: 1 }, { status: 1 });

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
