// let Image = require("./models/Image")
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { Mongoose } = "mongoose";
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const adminauthRoutes = require("./routes/adminauthRoutes")


const app = express();
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected"))
.catch(() => console.log("Database not connected", error))

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use("/", authRoutes )
app.use("/", adminauthRoutes)

const port = 8888;
app.listen(port, console.log(`Server is running on port ${port}`));