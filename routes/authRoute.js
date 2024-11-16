const express = require("express");
const { createUser, loginUser } = require("../controllers/authController");
const route = express.Router();

route.post("/auth/signin", loginUser);
route.post("/auth/signup", createUser);

module.exports = route;
