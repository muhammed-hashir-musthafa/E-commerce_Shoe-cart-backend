const express = require("express");
const app = express();
const cors = require("cors");
const { config } = require("dotenv");
const connectDB = require("./config/db.js");
const userRouter = require("./Routes/userSide/userRoute.js");

config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
