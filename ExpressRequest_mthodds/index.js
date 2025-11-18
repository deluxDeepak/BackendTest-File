const express = require('express');
const app = express();
const PORT = 3000;

app.get('/profile',
    function (req, res) {
        console.log("Query output:", req.query);
        // Galat hai, kyunki res.send() sirf ek hi argument accept karta hai 
        // Do argument doge to Express sirf pehla argument bhej deta hai — baaki ignore ho jaata hai.
        // res.send("Name is ", req.query.name);    //Wrong
        // res.send("Name is " + req.query.name);   //Correct
        // res.send(`Age is  ${req.query.age}`);     //Correct

        res.send({name:req.query.name,age:req.query.age});
    });

app.listen(PORT,
    function (err) {
        if (err) console.log("Error in connecting with server", err);
        console.log("Server listening on PORT", PORT);
    });