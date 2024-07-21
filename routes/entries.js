//const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { Op, Sequelize } = require("sequelize");
const mailer = require("../utils/mailer");
const Entry = require("../models/Entry");
const User = require("../models/User");

router.post("/add", (req, res) => {
  //create an entry
  Entry.create({
    softwareId: req.body.softwareId,
    instName: req.body.instName,
    amount: req.body.amount,
    agentId: req.body.agentId,
    teamId: req.body.teamId,
    type: req.body.type,
    description: req.body.description,
    instLinker: req.body.instLinker,
    linker: req.body.linker,
    trace: req.body.trace,
    status: req.body.status,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((entry) => {
      res.json({ entry, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Expense couldn't be created",
      })
    );
});

module.exports = router;
