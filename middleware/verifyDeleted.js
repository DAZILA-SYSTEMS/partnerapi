const Lover = require("../models/Lover");
const { Op } = require("sequelize");

// Verify Lover
function verifyDeleted(req, res, next) {
  Lover.findOne({
    where: {
      [Op.or]: {
        [Op.and]: {
          deleted: 1,
          trace: {
            [Op.gt]: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          myPhone: { [Op.substring]: req.phone.slice(-8) },
          phone: { [Op.substring]: req.body.number.slice(-8) },
        },

        [Op.and]: {
          deleted: 1,
          trace: {
            [Op.gt]: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          myPhone: { [Op.substring]: req.phone.slice(-8) },
          phone: { [Op.substring]: req.body.number.slice(-8) },
        },
      },
    },
  })
    .then((lover) =>
      !lover
        ? next()
        : res.status(400).json({ status: 400, message: "deleted" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ status: 400, message: "Lover error Already Added" })
    );
}

module.exports = verifyDeleted;
