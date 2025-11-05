// connection of socket ping(to know the clinet  is alive or not ) and pong 
// ->Server check if the client is alive or dead 

const https = require("https");
const http = require("http");
const fs = require("fs");

// Scoket connection 
const socketio = require("socket.io");


const object = {
    cert: fs.readFileSync("cert.crt"),
    key: fs.readFileSync("cert.key")
}

// Https server mamking 
const server = https.createServer(object, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to Https Server You are secure now");
}).listen(8000, () => console.log("HTTPS Server running on https://localhost"));


// here ab option de sakte hai 
const io = socketio(server, {
    path: "/chat",
    serveClient: true,  // Serve socket.io.js to client (default: true)
    pingTimeout: 20000, // Time before disconnect if no pong (default: 20000ms)
    pingInterval: 25000,// Interval between pings (default: 25000ms)
})



http.createServer((req, res) => {
    res.writeHead(301, { location: "https://localhost:8000" + req.url });
    res.end("New to http server");
}).listen((3000), () => console.log("HTTP Server running on http://localhost:3000 (will redirect to HTTPS)"));









