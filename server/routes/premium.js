const express = require("express");
const router = express.Router();

const premiumControllers = require("../controllers/premium");

router.get("/getLeaderboard", premiumControllers.getLeaderboard);

module.exports = router;
