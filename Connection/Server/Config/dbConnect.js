const monggose=require('mongoose');
const ConnectDb=async ()=>{
    // monggose.connection.on("connection",()=>console.log("Connected Successfully"));
    await monggose.connect("mongodb+srv://dbuser:kumar@cluster0.5miebw6.mongodb.net/sample_mflix");
    console.log("Connected to Db");

}
module.exports=ConnectDb;