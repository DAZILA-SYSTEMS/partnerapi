require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// Database
const db = require("./config/database");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(cors());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const socketIo = require("socket.io");
//const SocketJoinRoom = require("./utils/SocketJoinRoom");

//create server for io
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Test DB
db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch((err) => console.log("Error: " + err));

// Adjust the limit for the request body size (e.g., 10MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//json parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//add socket io middleware
app.use((req, res, next) => {
	req.io = io;
	next();
});

// Index route
app.get("/", (req, res) => res.send("TechAgent"));

// auth routes
app.use("/auth", require("./routes/auth"));

//entry routes
app.use("/entry", require("./routes/entries"));

//team routes
app.use("/team", require("./routes/team"));

//insts routes
app.use("/inst", require("./routes/insts"));

//account routes
app.use("/account", require("./routes/account"));

//blog routes
app.use("/blog", require("./routes/blog"));

const PORT = process.env.PORT || 10000;

//app.listen(PORT, console.log(`Server started on port ${PORT}`));

io.on("connection", (socket) => {
	socket.on("joinRoom", (data) => {
		// SocketJoinRoom(data, socket);
	});
});

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
