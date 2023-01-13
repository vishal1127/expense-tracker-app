const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const authMiddleware = require("./middlewares/auth");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/user");

// app.use(authMiddleware);
app.use(userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
