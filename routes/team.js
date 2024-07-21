const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

router.post("/get", verifyToken, (req, res) => {
	User.findAll({
		attributes: ["name", "country", "id"],
		where: {
			teamId: req.userId + 1000,
		},
	})
		.then((data) => res.status(200).json({ data, status: 200 }))
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "server error" });
		});
});

module.exports = router;
