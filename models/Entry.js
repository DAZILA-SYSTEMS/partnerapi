const Sequelize = require("sequelize");
const db = require("../config/database");

const Entry = db.define("entry", {
  softwareId: {
    type: Sequelize.STRING,
  },
  instName: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.STRING,
  },
  currency: {
    type: Sequelize.STRING,
  },
  agentId: {
    type: Sequelize.STRING,
  },
  teamId: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  description: {
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
  status: {
    type: Sequelize.STRING,
  },
});

Entry.sync().then(() => {
  console.log("entry table created");
});
module.exports = Entry;
