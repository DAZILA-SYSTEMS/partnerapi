//const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

const DeleteImage = (fileName) => {
	let imagePath = path.join(__dirname, "../uploads", `${fileName}`);
	// Check if the file exists
	fs.access(imagePath, fs.constants.F_OK, (err) => {
		if (err) {
			console.error("Error:", err);
			return;
		}

		// Delete the file
		fs.unlink(imagePath, (err) => {
			if (err) {
				console.error("Error:", err);
				return;
			}
			console.log("Image deleted successfully.");
		});
	});
};

const UploadImage = async (base64Data, uniqueFilename) => {
	// Decode base64 data
	const base64Image = base64Data.split(";base64,").pop();

	const imagePath = path.join(__dirname, "../uploads", `${uniqueFilename}`);
	// Decode the base64 image data and save it to a file
	fs.writeFile(imagePath, base64Image, { encoding: "base64" }, function (err) {
		if (err) {
			console.log("Error:", err);
		} else {
			console.log("Image saved successfully.");
		}
	});

	return uniqueFilename;
};

//add blog
router.post("/add", (req, res) => {
	if (req.body.password !== process.env.PRO_PASS) {
		return res.json({
			status: 500,
			message: "Unknown error",
		});
	}
	let uniqueFilename =
		req.body.photo.length > 100
			? `techsystems-${req.body.title}-${Date.now()}.${
					req.body.photo.split("/")[1].split(";")[0]
			  }`
			: "techsystems.jpg";
	UploadImage(req.body.photo, uniqueFilename);
	Blog.create({
		blog: req.body.blog,
		photo: uniqueFilename,
		title: req.body.title,
		trace: Date.now(),
		live: 0,
		deleted: 0,
	})
		.then((data) => {
			res.status(200).json({ status: 200, data });
		})
		.catch((err) =>
			res.status(500).json({ status: 500, err, message: "error has occured" })
		);
});

//get blogs
router.post("/get", (req, res) => {
	Blog.findAll({
		where: {
			deleted: 0,
		},
	})
		.then((data) => {
			res.status(200).json({ status: 200, data });
		})

		.catch((err) =>
			res.status(500).json({ status: 500, message: "error has occured" })
		);
});

//update blog
router.post("/update", (req, res) => {
	if (req.body.password !== process.env.PRO_PASS) {
		return res.json({
			status: 500,
			message: "Unknown error",
		});
	}
	Blog.findOne({
		where: {
			id: req.body.id,
		},
	})
		.then((blog) => {
			if (blog != null) {
				let uniqueFilename =
					req.body.photo === blog.photo
						? blog.photo
						: `techsystems-${req.body.title}-${Date.now()}.${
								req.body.photo.split("/")[1].split(";")[0]
						  }`;

				if (req.body.photo !== blog.photo) {
					UploadImage(req.body.photo, uniqueFilename);
					DeleteImage(blog.photo);
				}

				blog.blog = req.body.blog;
				blog.title = req.body.title;
				blog.photo = uniqueFilename;
				blog.deleted = req.body.deleted;
				blog.trace = Date.now();
				blog.save();
				res.status(200).json({ status: 200, data: blog });
			} else {
				res.status(404).json({ status: 404, message: "Blog Not found" });
			}
		})
		.catch((err) =>
			res.status(500).json({ status: 500, message: "error has occured" })
		);
});

module.exports = router;
