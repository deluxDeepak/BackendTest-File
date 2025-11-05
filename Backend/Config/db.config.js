const mongoose = require("mongoose");

const ConnectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://dbuser:kumar@cluster0.5miebw6.mongodb.net/CoderArmy");
        console.log("✅Conected DB Successfully");
    } catch (error) {
        console.log("Error in connecting to DB", error);
    }
}

module.exports = ConnectDb;