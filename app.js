const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const userRouter = require("./routes/UserRoute");
const contactRouter = require("./routes/ContactRoute")

const app = express();

app.use(cors())

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter)


module.exports = app