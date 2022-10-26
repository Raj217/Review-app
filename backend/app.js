require("dotenv").config();
const express = require("express");
require("./db");
require("express-async-errors");
const { errorHandler } = require("./middlewares/errorHandler");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Listening to port 8000");
});
