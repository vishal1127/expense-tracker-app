const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const premiumControllers = require("../controllers/premium");

router.get(
  "/getLeaderboard",
  authMiddleware,
  premiumControllers.getLeaderboard
);

module.exports = router;
