const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("User", {
  full_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = User;
