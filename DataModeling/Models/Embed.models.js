// Embeded model 

const mongoose=require('mongoose');
const userAdress=new mongoose.Schema({
    city:String,
    village:String
})

const userSchema=new mongoose.Schema({
    name:String,
    email:String,

    // UserAdress Object hi hai ye new keyword se bana hua hai 
    address:[userAdress]
    // address:[
    // {city:---,village:---}
    // ]
})
const User1=mongoose.model("UserEbd",userSchema);
module.exports=User1;
