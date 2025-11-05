// // Normal https server 

// const https = require('https');
// const fs = require("fs");
// // fs to read and write operation from the file 
// // https.createServer(Option,(req,res)=>{

// // })
// const option = {
//     key: fs.readFileSync("cert.key"),
//     cert: fs.readFileSync("cert.crt")

// }
// https.createServer(option, (req, res) => {
//     res.writeHead(200, { "content-type": "text/plain" });
//     res.end("Hey User server is Running ");
// }).listen(3000, () => console.log("Server is running at port number 3000"));



// Redirect use in http and https 
const https = require("https");
const http = require("http");
const fs = require("fs");


const object = {
    cert: fs.readFileSync("cert.crt"),
    key: fs.readFileSync("cert.key")
}

// Https server mamking 
https.createServer(object, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to Https Server You are secure now");
}).listen(8000, () => console.log("HTTPS Server running on https://localhost"));


// http server only for redirecting 
// 301:satus for permanent move show karne ke liye 
// req.headers.host :localhost:8000
// req.url ;Routing batayega 




// Agar tum future me default ports (HTTP → 80, HTTPS → 443) use karte ho, to req.headers.host theek chalega (kyunki browser automatically port attach karega).
// Lekin jab custom port use karte ho (3000, 8000), to manually fix karna padta hai.
http.createServer((req, res) => {
    res.writeHead(301, { location: "https://localhost:8000" + req.url });
    res.end("New to http server");
}).listen((3000), () => console.log("HTTP Server running on http://localhost:3000 (will redirect to HTTPS)"));









