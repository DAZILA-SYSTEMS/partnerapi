const express = require("express");
const fetch = require("isomorphic-fetch");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.post("/add", verifyToken, (req, res) => {
  fetch("http://localhost:5000/agent/add", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ ...req.body, agentId: req.userId + 1000 }),
  })
    .then(async (data) => {
      let JsonData = await data.json();
      res.status(200).json({ ...JsonData });
    })
    .catch((err) => res.status(500).json({ message: "server error" }));
});

router.post("/get", verifyToken, (req, res) => {
  fetch("http://localhost:5000/agent/get", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ agentId: req.userId + 1000 }),
  })
    .then(async (data) => {
      let JsonData = await data.json();
      res.status(200).json({ ...JsonData });
    })
    .catch((err) => res.status(500).json({ message: "server error" }));
});

module.exports = router;
