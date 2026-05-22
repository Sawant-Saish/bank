const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

async function userRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const isExists = await userModel.findOne({
      $or: [{ email: email }, { name: name }],
    });

    if (isExists) {
      return res.status(422).json({
        message: "User already exists",
      });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  userRegisterController,
};
