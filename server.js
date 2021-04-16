require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


//holds list of users in a room
const rooms = {};

//generate connection using socket, allowing 2 users to join 1 room
//if they have the same URL ID
io.on("connection", socket => {
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    //Interactive Connectivity Establishment
    //carries information about the IP address and port for use with Heroku and P2P
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});

//when yarn build is ran - app uses client directory
//
if (process.env.PROD) {
    app.use(express.static(path.join(_dirname, './client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(_dirname, '.client/build/index.html'));
    });
}

//use port 8000 unless in development mode
const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));
