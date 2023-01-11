const User = require("../models/user");

exports.createUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  User.create({
    name: name,
    email: email,
    password: password,
  })
    .then(() => {
      res.status(200).send("User is successfuly registered");
    })
    .catch((err) => {
      console.log("err.message--------->", err.name);
      if (err.name == "SequelizeUniqueConstraintError")
        res.status(403).send("User with this email is already registered");
      else res.status(403).send("Something went wrong");
    });
};
