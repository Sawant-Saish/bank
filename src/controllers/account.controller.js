const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: req.user._id,
    });

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = { createAccountController };
