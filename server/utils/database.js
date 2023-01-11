const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("expense-tracker", "root", "admin", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
