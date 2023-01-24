const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const DownloadedExpenseReport = sequelize.define("DownloadedExpenseReport", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = DownloadedExpenseReport;
