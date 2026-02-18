const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 8080;
const authRoutes = require("./routes/auth");
const macrosRoutes = require("./routes/macros");
const trainerRoutes = require("./routes/trainer");
const userRoutes = require("./routes/user");
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Server is Running");
  res.send("Hello from FitMeasure Server");
});
app.use("/auth", authRoutes);
app.use("/macros", macrosRoutes);
app.use("/trainer", trainerRoutes);
app.use("/user", userRoutes);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
