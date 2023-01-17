const jwt = require("jsonwebtoken");
const SECRET_KEY = "expense-app-secret-key";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      //decrypting token
      let userDetails = jwt.verify(req.headers.authorization, SECRET_KEY);
      req.userId = userDetails.id;
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
