const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Entry = require("../models/Entry");
const User = require("../models/User");
const fetch = require("isomorphic-fetch");

const FetchExchanges = () => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_ID}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				method: "GET",
			}
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error(response);
				} else {
				}

				return response.json();
			})
			.then((data) => {
				resolve(data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

//agent withdraw
router.post("/withdraw", verifyToken, (req, res) => {
	if (req.body.amount < 6) {
		res.status(500).json({ message: "server error", status: "500" });
		return;
	}
	//verify Amount first
	Entry.findAll({
		where: {
			[Op.or]: [{ agentId: req.userId + 1000 }, { teamId: req.userId + 1000 }],
		},
	})
		.then((data) => {
			if (
				data
					.filter((account) => {
						return (
							parseInt(account.status) === 0 &&
							(account.type === "agent" ||
								account.type === "team" ||
								account.type === "bonus")
						);
					})
					.reduce((a, b) => +a + +b.amount, "00") -
					data
						.filter((account) => account.type === "withdraw")
						.reduce((a, b) => +a + +b.amount, "00") >=
				req.body.amount
			) {
				//Add withdraw entry
				Entry.create({
					amount: req.body.amount,
					currency: req.body.currency,
					softwareId: req.body.email,
					linker: Date.now(),
					agentId: req.userId + 1000,
					type: "withdraw",
					live: 0,
					deleted: 0,
					status: 1,
				})
					.then((data) => {
						res.status(200).json({ data, status: 200 });
					})
					.catch((err) =>
						res.status(500).json({ message: "server error", status: "500" })
					);
			} else {
				res.status(500).json({ message: "server error" });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: "server error" });
		});
});

//adding a deposit
router.post("/interlink", (req, res) => {
	//create for the agent directly
	Entry.create({
		softwareId: req.body.softwareId,
		instName: req.body.instName,
		amount: req.body.amount * 0.25,
		currency: req.body.currency,
		agentId: req.body.agentId,
		type: "agent",
		linker: Date.now(),
		live: 0,
		deleted: 0,
		status: 0,
	})
		.then((data) => {
			//get agent team id from user
			User.findOne({
				where: {
					id: req.body.agentId - 1000,
				},
			})
				.then((user) => {
					if (user) {
						Entry.create({
							softwareId: req.body.softwareId,
							instName: req.body.instName,
							amount: req.body.amount * 0.1,
							currency: req.body.currency,
							teamId: user.dataValues.teamId,
							type: "team",
							linker: Date.now(),
							live: 0,
							deleted: 0,
							status: 0,
						})
							.then()
							.catch();
					}
				})
				.catch();
			res.status(200).json({ data, status: 200 });
		})
		.catch((err) => res.status(500).json({ message: "server error" }));
});

//get all entries
router.post("/get", verifyToken, (req, res) => {
	Entry.findAll({
		where: {
			[Op.or]: [{ agentId: req.userId + 1000 }, { teamId: req.userId + 1000 }],
		},
		order: [["id", "DESC"]],
	})
		.then((data) => res.status(200).json({ data, status: 200 }))
		.catch((err) => {
			res.status(500).json({ message: "server error" });
		});
});

//fetch current exchange rates
router.post("/exchange", (req, res) => {
	FetchExchanges()
		.then((data) => {
			if (data.rates) {
				return res.json({
					status: 200,
					data: data.rates,
				});
			} else {
				res.json({
					status: 500,
					message: "Unknown error",
				});
			}
		})
		.catch((error) => {
			res.json({
				status: 500,
				message: "Unknown error",
			});
		});
});

module.exports = router;
