const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/UserRoute");
const contactRouter = require("./routes/ContactRoute")

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter)


module.exports = app;