const express = require('express');
const http = require('http');
const cors = require("cors");
const students = require("./Utils/Student.js");
const { Server } = require('socket.io')

const app = express();
const server = http.createServer(app);
// Middleware 
app.use(cors());
app.use(express.json());
// lekin CORS ka setup WebSocket ke liye bhi explicitly dena chahiye, warna kabhi-kabhi connection polling pe atak jata hai.

// Socket.IO instance with CORS
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// =>Agar sab clients ko update karna hai, to io.emit() use karo
// =>Agar sirf ek client ko bhejna hai, to client.emit()
// =>Agar baaki sab clients ko except sender bhejna hai, to client.broadcast.emit()


// Socket io Connection *************************************
io.on("connection", (client) => {
    // kaun sa Client Connected hai 
    console.log(client.id);

    // only client se message receive kar  rehe hai 
    client.on("clintMessage",(msg)=>{
        console.log("Message from the CLinet",msg);
    })
    
    // Hum kya client ko message bhejnge 
    client.emit("message", `Hello ${client.id}, You are  connected to the server `);
})





// Rest api*****************************
// Send the details of the user 
app.get("/user", (req, res) => {
    try {
        res.json(students);
        // console.log(students);
    } catch (error) {
        res.send(error.message);
        console.log("Error", error.message);
    }
});

app.post("/user", (req, res) => {
    try {
        const { name, collegeName, RegistrationNumber } = req.body;

        // Agr database se connected rehta to 

        // Crate and save to the database 
        // const user=new User.create({
        //     name,
        //     collegeName,
        //     RegistrationNumber
        // })
        console.log(name, collegeName, RegistrationNumber);

        res.json({ success: true, message: "Created Successfully" });


    } catch (error) {

    }
})




const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`✅Listening at Port ${port}`);
})