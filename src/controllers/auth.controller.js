const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * @description    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */

async function userRegisterController(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  userModel.create({ name, email, password });

  const isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res.status(422).json({ message: "Email already exists" });
  }

  const user = await userModel.create({ name, email, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

module.exports = {
  userRegisterController,
};
