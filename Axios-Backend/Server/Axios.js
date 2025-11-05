const express = require("express");
const cors = require("cors");
const students = require("./Utils/Student.js");



const app = express();


// Middleware 
app.use(cors());
app.use(express.json());



// Send the details of the user 
app.get("/user", (req, res) => {
    try {
        res.json(students );
        // console.log(students);
    } catch (error) {
        res.send(error.message);
        console.log("Error", error.message);
    }
});

app.post("/user",(req,res)=>{
    try {
        const {name,collegeName,RegistrationNumber}=req.body;

        // Agr database se connected rehta to 

        // Crate and save to the database 
        // const user=new User.create({
        //     name,
        //     collegeName,
        //     RegistrationNumber
        // })
        console.log(name,collegeName,RegistrationNumber);

        res.json({success:true, message:"Created Successfully"});

        
    } catch (error) {
        
    }
})









const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`✅Listening at Port ${port}`);
})