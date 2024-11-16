const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const connectDB = require("./db/connect");
const carRoute = require("./routes/carRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const User = require("./model/User");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const app = express();

// Serve static files for uploads
const uploadsPath = path.join(__dirname, "middlewares", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Authentication middleware
const isAuth = async (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send({ error: "You must be logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, SECRET_KEY);

    if (verified) {
      const user = await User.findOne({ _id: verified.id }).populate("cars");
      req.user = user;
      next();
    } else {
      return res.status(401).json({ data: "Unauthorized" });
    }
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ data: "Unauthorized" });
  }
};

app.use(express.static("build"));
app.use(cors({
  origin: 'https://assignment-frontend-sand.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // if credentials are needed
}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(authRoute);
app.use(isAuth, carRoute);
app.use(isAuth, userRoute);

app.use("/check", isAuth, (req, res) => {
  try {
    return res.status(200).send({ data: req.user });
  } catch (err) {
    return res.status(401).send({ data: "Unauthorized" });
  }
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(uri);
    console.log("Connected to Database...");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
