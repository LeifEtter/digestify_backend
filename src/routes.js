const { Router } = require("express");
const FoodController = require("./controllers/food.js");
const { register, login } = require("./controllers/user.js")

const route = Router();

route.post("/addFood", FoodController.AddFood);
route.post("/signup", );
route.post("/login", login);
route.post("/register", register);

module.exports = route;