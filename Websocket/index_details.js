const express = require('express'); 
const http = require('http');          
const socketio = require('socket.io')

const app = express();                 
const server=http.createServer(app);   
const io=socketio(server);            

// ✅ Static assets ke liye best (HTML, CSS, JS, images).
// ❌ Har file ko manually route define karne ki zaroorat nahi.
// Public folder ko serve karna hai yehan se 
// http://localhost:3000/index.html browser bina index.html hit kiye ye index file read kar reha hai 
// only ye hit karke http://localhost:3000/
// Agr different file persent hoga to rounting karke access karna hoga 

app.use(express.static('./Public'));



// ✅ Jab tumhe ek specific file ya custom response dena ho tab use hota hai.
// ❌ Agar har static file manually bhejni padti to code messy ho jata.
// Ek file ek route pe milega 
// app.get('/', (req, res) => {
//     res.sendFile("./Public/index.html");

// });





// Main yehan se use karna (Socket io)
// socket(client)=>Client information hota hai (Ye only connection handle karta hai )
io.on('connection', socket => {
    // socket.handshake isme handshake ka detail rehega matlab ye ek object hi hai 
    console.log('✅ Client connected via WebSocket',socket.handshake.time);
    console.log('✅ Client connected via WebSocket',socket.id);



    socket.on('chat message', (msg) => {
        var messageFromClient=msg;
        console.log("Message from client:", msg);

        // sab clients ko broadcast karta hai( Matlab sabko send karta hai)

        // =>Agr ye line hata denge to client ke pass wapis ye message nahi jayega (Jo client bhej reha hai wo osko nahi dikhega )
        // io.emit('chat message', msg); 
        socket.emit("chat message",msg)
    });

    // Jab refresh karenge webpage ko tab ye disconnect karega 
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});






server.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
