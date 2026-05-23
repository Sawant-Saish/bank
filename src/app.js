const express = require("express");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * @description Importing Routes
 */

const authRoutes = require("./routes/auth.routes");
const accountRouter = require("./routes/account.route");

/**
 * @description API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRouter);

module.exports = app;
