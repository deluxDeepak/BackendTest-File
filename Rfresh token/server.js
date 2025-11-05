const express = require("express");
const ConnectDb = require("./Config/db.config");
const  {Sign,login, refresh}  = require("./Controllers/Users");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());


app.post('/sign', Sign);
app.get('/login', login);
app.post('/refresh', refresh);  //Ye undefine isiliye aa reha tha ki cookie parser nahi tha 


const PORT = process.env.PORT || 3000
const main = async () => {
    try {
        // wait until DB connects {Jab tak db connect nahi ho jata hai tab tak sever connect nahi hoga }
        await ConnectDb();
        app.listen(PORT, () => {
            console.log(`Listinig at port number ${PORT}`)
        })

    } catch (error) {
        console.log("Error In Connecting ", error);
    }
}

main();
