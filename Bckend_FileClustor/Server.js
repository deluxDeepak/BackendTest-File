// Entry point of backend app 

// const dotenv=require('dotenv')
// Pehle env ko configure karo fir (pure app ise hi use karega isiliye )
require('dotenv').config()
const express=require('express')
const app=express();

// to implement cros origin we use cors 
const cors=require('cors');
const connectDb=require('./Config/db')
const router=require('./Routes/userRoutes')
const cookieParser=require('cookie-parser')

// Ye deafult hai sabkuch sab origin allow kar dega( isme credential nahi le sakte hai ) 
// app.use(cors());

// Ye karna chiye only fronted allow karega jo likha yehan pe 
const corsOption={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOption));


// dotenv.config();
connectDb();

app.use(express.json());

// Iske bina cookie undefine ayega 
app.use(cookieParser());


// Entery points of routes 
app.use('/api/user',router);



const port=process.env.PORT ||5000
app.listen(port,()=>{
    console.log(`✅Server running at port ${port}`);
})