const express = require("express");
const cors = require("cors");
// const session = require("express-session");
// const ws = require("ws");
// const WebSocket = require("ws");
const app = express();
const gameModifiedRoutes = require("./routes/gameModifiedRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   session({
//     key: "data",
//     secret: "reyuer",
//     resave: false,
//     saveUninitialized: false,
//     // cookie: {
//     //   maxAge: 10000,
//     // },
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use("/api/baccarat", gameModifiedRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});

// if you want to use the websocket:
// const server = app.listen(PORT, () => {
//     console.log("Server is running at port", PORT);
//   });

// const wss = new WebSocket.Server({ server });

// let rooms = {};
// let clients = new Set();

// const sendRoom = (roomName, message, ws) => {
//   if (rooms[roomName]) {
//     rooms[roomName].forEach((senderWs) => {
//       if (senderWs !== ws) {
//         ws.send(JSON.stringify({ message }));
//       }
//     });
//   }
// };

// const sendToAllRoom = (roomName, message) => {
//   if (rooms[roomName]) {
//     rooms[roomName].forEach((senderWs) => {
//       senderWs.ws.send(JSON.stringify({ message }));
//     });
//   }
// };

// const sendToClient = (roomName, message, id) => {
//   if (rooms[roomName]) {
//     rooms[roomName].forEach((client) =>
//       client.player_id === id
//         ? client.ws.send(JSON.stringify({ message }))
//         : client
//     );
//   }
// };

// const disconnectedClient = (roomName, id) => {
//   if (rooms[roomName]) {
//     rooms[roomName].forEach(
//       (client) => {
//         if (client.player_id === id) {
//           rooms[roomName].delete(client);
//         }

//         if (client.player_id === null) {
//           rooms[roomName].delete(client);
//         }
//       }
//       // client.player_id === id ? (client.player_id = null) : client
//     );
//   }
// };

// wss.on("connection", (ws) => {
//   const joinedRoom = (roomName, id) => {
//     if (!rooms[roomName]) {
//       rooms[roomName] = new Set();
//     }

//     const user = {
//       ws: ws,
//       player_id: id,
//     };

//     rooms[roomName].add(user);
//     // console.log(`A client joined the room ${roomName}`);
//   };

//   ws.on("message", (data) => {
//     const parsedData = JSON.parse(data);
//     clients.add(ws);
//     // console.log(parsedData);

//     if (parsedData.type === "joined_room") {
//       joinedRoom(parsedData.room, parsedData.player_id);
//     }

//     ws.on("close", () => {
//       for (let roomName in rooms) {
//         rooms[roomName].delete(ws);
//         if (rooms[roomName].size === 0) {
//           delete rooms[roomName];
//         }
//       }

//       console.log("A client disconnected");
//     });
//   });
// });
