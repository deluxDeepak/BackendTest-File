const express = require('express');       // (1) Express import
const http = require('http');            // (2) HTTP server import
const socketio = require('socket.io');   // (3) Socket.io import

const app = express();                   // (4) Express app banaya
const server=http.createServer(app);   // (5) HTTP server banaya using express
const io=socketio(server);           // (6) Socket.io bind kiya us HTTP server se



// Aise bhi path de sakte hai (aise hi dena chiye path ko )
// const path=require('path');
// app.use(express.static(path.resolve('./Public')));







// dusra tarika bhi hai 
// const io=new socketio(server);


// Public folder ko serve karna hai yehan se 
app.use(express.static('./Public'));





// (7) Express route (normal HTTP)
app.get('/', (req, res) => {
    // res.send('Hello from Express route!');
    res.sendFile("./Public/index.html");

});

// Main yehan se use karna 
// (8) Socket.io connection (WebSocket)
io.on('connection', socket => {
    console.log('✅ Client connected via WebSocket');

    socket.on('chat message', (msg) => {
        console.log("Message from client:", msg);
        io.emit('chat message', msg); // Send to all clients
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

// (9) Start the server
server.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
