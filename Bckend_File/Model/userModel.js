const mongoose =require('mongoose')
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        default:""
    },
    userAge:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    }
})
// const User=mongoose.model('Userdb',userSchema);
// module.exports=User;
module.exports=mongoose.model('Userdb',userSchema);