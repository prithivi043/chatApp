const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://127.0.0.1:27017/chatdb");

const MessageSchema = new mongoose.Schema({
  room: String,
  username: String,
  text: String,
  fileName: String,
  isFile: Boolean,
  time: String,
  replyTo: Object,
});

const RoomSchema = new mongoose.Schema({
  name: String,
});

const Message = mongoose.model("Message", MessageSchema);
const Room = mongoose.model("Room", RoomSchema);

let onlineUsers = [];

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ fileUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

app.get("/rooms", async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

app.post("/rooms", async (req, res) => {
  const { name } = req.body;
  const room = new Room({ name });
  await room.save();
  res.json(room);
  io.emit("room_list_updated");
});

io.on("connection", (socket) => {
  socket.on("user_connected", (username) => {
    if (!onlineUsers.includes(username)) onlineUsers.push(username);
    io.emit("update_online_users", onlineUsers);
  });

  socket.on("join_room", async (room) => {
    const msgs = await Message.find({ room });
    socket.join(room);
    socket.emit("previous_messages", msgs);
  });

  socket.on("send_message", async (data) => {
    const newMsg = new Message(data);
    await newMsg.save();
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // You can improve user removal logic using socket.id + user map
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
