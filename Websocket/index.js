const express = require('express');
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('./Public'));

// Ek file ek route pe milega 
// app.get('/', (req, res) => {
//     res.sendFile("./Public/index.html");

// });


io.on('connection', socket => {
    // socket.handshake isme handshake ka detail rehega matlab ye ek object hi hai 
    console.log('✅ Client connected via WebSocket', socket.handshake.headers["user-agent"]);

    // Create a room to message (Frontend se clinet join karega room me )
    // wo jis room ka name dega wo roomName ke jagah aa jayega 
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        console.log("Room name is: ", roomName);
        console.log(`${socket.id} joined room ${roomName}`);

        // Notify other room members 
        // ye room ke sare member ko send karega message 
        // io.to(roomName).emit("Message",`${socket.id} has joined ${roomName}`);

        // Ye sare member ko send karega lekin jo join join hua hai osko chorke 
        socket.to(roomName).emit("message ", `${socket.id} has joined ${roomName}`);

    });



    // Sabko message bhejne wala kam 
    // socket.on('chat message', (msg) => {
    //     var messageFromClient = msg;
    //     console.log("Message from client:", msg);


    //     socket.emit("chat message", msg)
    // });

    // room me message bhejna 
    socket.on("chatMessage", ({ room, msg }) => {
        io.to(room).emit("message", `${socket.id}: ${msg}`);
    });


    // Jab refresh karenge webpage ko tab ye disconnect karega 
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});






server.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
