const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users");

router.post("/createUser", userControllers.createUser);

router.post("/signInUser", userControllers.signinUser);

router.post("/password/forgotpassword", userControllers.sendResetLink);

router.get("/password/resetpassword/:resetId", userControllers.resetPassword);

router.post(
  "/password/updatepassword/:resetId",
  userControllers.updatePassword
);

module.exports = router;
