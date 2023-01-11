const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");

const app = express();
app.use(bodyParser.json());

const userRoutes = require("./routes/user");

app.use(userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
