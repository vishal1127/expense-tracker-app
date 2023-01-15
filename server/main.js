const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const authMiddleware = require("./middlewares/auth");
const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

app.use(userRoutes);
app.use(authMiddleware);
app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
