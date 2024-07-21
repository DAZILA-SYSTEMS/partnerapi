const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("user", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    startAt: 1001,
  },
  name: {
    type: Sequelize.STRING,
  },
  logger: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  photo: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  teamId: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  socket: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
  },
  reset: {
    type: Sequelize.STRING,
  },
  linker: {
    type: Sequelize.STRING,
  },
  trace: {
    type: Sequelize.STRING,
  },
  live: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.STRING,
  },
});

User.sync().then(() => {
  console.log("user table created");
});
module.exports = User;
