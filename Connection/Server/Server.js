const express=require("express");
const cors=require("cors");
const ConnectDb=require('./Config/dbConnect.js');
const User=require("./Model/User.models.js");


const app=express();

// =>Allow all origin by defalut 
// =>Allow all method 
// Does not allow credential (means cookies and token )
app.use(cors());

app.get("/user",async (req,res)=>{
    const users_details=await User.find();
    res.json({data:users_details});
})

// Connection and Server satring 
ConnectDb();
app.listen(3000,()=>{
    console.log("Connected to port 3000");
})






// // Created server with http method 
// const http=require("http");
// const app=http.createServer((req,res)=>{

//     const {method,url}=req;
//     console.log(method);
//     console.log(url);

//     if (method==="GET"&& url==="/") {
//         res.end("This is Home page"); 
//     }
//     else
//         res.end("Route not found ");
// });




// app.listen(3000,()=>{
//     console.log("Listining at the port number 3000");
// })