const mongoose=require('mongoose')

 const dbConnect=async ()=>{
    await mongoose.connect("mongodb+srv://dbuser:kumar@cluster0.5miebw6.mongodb.net/DataModeling")
    console.log("✅Conected DB Successfully");
}
module.exports=dbConnect;