const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "expense-app-secret-key";

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findAll({
      where: {
        email: email,
      },
    });
    if (existingUser.length) {
      return res
        .status(400)
        .json({ message: "User with this email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    // const token = jwt.sign({ email: email, id: result.id }, SECRET_KEY);
    res.status(201).json({ user: result, success: true });
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
};

exports.signinUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findAll({ where: { email: email } });
    if (existingUser.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(
      password,
      existingUser[0].password
    );
    if (!matchPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign(
      {
        email: email,
        id: existingUser[0].id,
        isPremium: existingUser[0].isPremium,
      },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong!!" });
  }
};
