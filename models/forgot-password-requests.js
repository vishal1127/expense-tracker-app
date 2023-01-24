const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const uuid = require("uuid");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = ForgotPasswordRequest;
