const mongoose = require('mongoose')
const connectDb = async () => {
    await mongoose.connect(process.env.URL_DB);
    console.log("✅Conected DB Successfully");
}
module.exports = connectDb;