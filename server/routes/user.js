const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users");

router.post("/createUser", userControllers.createUser);

router.post("/signInUser", userControllers.signinUser);

module.exports = router;
