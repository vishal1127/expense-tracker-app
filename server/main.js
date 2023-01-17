require("dotenv").config();
// console.log("process envvvvvvvv-------", process.env.NODE_ENV_RAZORPAY_KEY_ID);
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const authMiddleware = require("./middlewares/auth");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");

app.use(userRoutes);
app.use(authMiddleware);
app.use(expenseRoutes);
app.use(purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
