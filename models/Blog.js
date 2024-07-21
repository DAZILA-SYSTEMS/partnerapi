const Sequelize = require("sequelize");
const db = require("../config/database");

const Blog = db.define("blog", {
	blog: {
		type: Sequelize.STRING,
	},
	title: {
		type: Sequelize.STRING,
	},
	photo: {
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

Blog.sync().then(() => {
	console.log("blog table created");
});

module.exports = Blog;
