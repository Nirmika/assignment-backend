const express = require("express");
const {
  fetchUserById,
} = require("../controllers/userController");
const route = express.Router();

route.get("/users/:id", fetchUserById);

module.exports = route;
