const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const fs = require("fs");
const DATA_FILE = path.join(__dirname, "auctionData.json");

const app = express();
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const INITIAL_TEAMS = [
  { name: "RCB", purse: 3500, spent: 0, players: [] },
  { name: "CSK", purse: 3500, spent: 0, players: [] },
  { name: "RR", purse: 3500, spent: 0, players: [] },
  { name: "LSG", purse: 3500, spent: 0, players: [] },
  { name: "MI", purse: 3500, spent: 0, players: [] },
  { name: "GT", purse: 3500, spent: 0, players: [] },
  { name: "DC", purse: 3500, spent: 0, players: [] },
  { name: "SRH", purse: 3500, spent: 0, players: [] },
  { name: "KKR", purse: 3500, spent: 0, players: [] },
  { name: "PBKS", purse: 3500, spent: 0, players: [] }
];

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });



app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ filename: req.file.filename });
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Shared Auction State
let auctionState = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE,"utf-8"))
  : {
      currentPlayerId: null,
      phase: "standby",
      players: [],
      teams: [],
      history: []
    };



if (!auctionState.teams || auctionState.teams.length === 0) {
  auctionState.teams = INITIAL_TEAMS;
}


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current state when client joins
  socket.emit("state:update", auctionState);

  // Admin updates auction
  socket.on("state:update", (newState) => {
      auctionState = {
        ...auctionState,
        ...newState
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(auctionState, null, 2));

      io.emit("state:update", auctionState);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Auction server running on port 3001 (network visible)");
});