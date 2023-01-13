const jwt = require("jsonwebtoken");
const SECRET_KEY = "expense-app-secret-key";

const auth = (req, res, next) => {
  try {
    const token = jwt.verify(req.headers.authorization);
    if (token) {
      console.log("token", token);
    } else {
      res.status(401).json({ message: "Unauthorized user" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized user" });
  }
};

module.exports = auth;
