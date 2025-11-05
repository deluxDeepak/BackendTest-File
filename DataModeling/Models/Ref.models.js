const mongoose=require('mongoose');
const { schema, init, validate } = require('./Embed.models');

// Adress Schema related to user (User ke pass adress hoga )
const userAdress=new mongoose.Schema({
    city:String,
    village:String
})

const userSchema=new mongoose.Schema({
    name:String,
    email:String,

    // User ka adress field jo hai  ek UserAdress(upper me jo bana hai oska ) document ka ObjectId(_id) store karega.
    // =>Useradress pehle banana parega (tabhi to oska object ka id yehan ayega )
    address:{type:mongoose.Schema.Types.ObjectId,ref:"UserAdress"}
},{timestamps:true})
const UserAdress=mongoose.model("UserAdress",userAdress);
const User=mongoose.model("User",userSchema);




// **************************Document Middleware**************************
// Middleware bana sakte hai jo schema level pe har bar schema ke particular value ko verfify kare 
// schema.pre("EVETNT dena hoga ",function(next){
//     // Only pre me {this} curr document ko prefer karega 
// })

// schema.post("EVETNT dena hoga ",function(doc,next){
//     // Only pre me {doc} curr document ko prefer karega 
// })


// Common event used 
// =>save
// =>init
// =>remove
// =>validate






// **************************************Aggregate middleware **************************************





module.exports={
    User,
    UserAdress
};
