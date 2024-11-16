const express = require("express");
const {
  addCar,
  updateCar,
  deleteCar,
  viewCars,
  getSingleCar,
} = require("../controllers/carController");
const route = express.Router();

route.post("/cars", addCar);
route.get("/cars", viewCars);
route.get("/cars/:id",getSingleCar);
route.patch("/cars/:id", updateCar);
route.delete("/cars/:id", deleteCar);

module.exports = route;
