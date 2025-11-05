const express = require("express");
const bodyParser = require("body-parser");
const { Server, Socket } = require("socket.io");

// socket server initilization 
const io = new Server({
    cors:{
        origin:"*"
    }
});
const app = express();

// Middleware 
app.use(bodyParser.json());

// Email mapping using map 
const emailToSocketMapping=new Map();
const socketToEmailMapping=new Map();




// Ye express server ke tarah man sakte ho 
io.on("connection", (socket) => {

    console.log("New connection");
    socket.on("joined-room", data => {

        const { roomId, emailId } = data;
        console.log("User" ,emailId,"joined Room number ",roomId);



        // emailId se socket id ko connect kar diye hai (Mapping)
        emailToSocketMapping.set(emailId,socket.id);
        socketToEmailMapping.set(socket.id,emailId);










        socket.join(roomId);
        // frontend ke pass message bhejna ki room ko join karwa diya hai 
        socket.emit("joinedyour-room",{roomId});

        socket.broadcast.to(roomId).emit('user-joined', { emailId })

    });


    socket.on('call-user',(data)=>{
        const {emailId,offer}=data;
        const socketId=emailToSocketMapping.get(emailId);
        const fromEmail=socketToEmailMapping.get(socket.id);
        socket.to(socketId).emit('incomming-call',{})

    })
});





app.listen(8000, () => console.log("http server is running at port 8000"));
io.listen(8001);