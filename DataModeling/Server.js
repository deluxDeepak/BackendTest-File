const express = require('express');
const { User, UserAdress } = require('./Models/Ref.models');
const dbConnect = require('./Config/dbConnect.js');
const User1 = require('./Models/Embed.models.js');

const app = express();
app.use(express.json());

dbConnect();


// ******Ref Model***********
app.post('/', async (req, res) => {
    const { name, email, city, village } = req.body;
    if (!name || !email || !city || !village) {
        res.json({ success: false, message: "Provide the detaisls" })
    }
    try {
        // Step 1: Pehle Address save karo
        const address = new UserAdress({
            city: city,
            village: village
        });
        await address.save();

        // Step 2: User save karo aur adress me address ka _id daalo
        const user1 = new User({
            name: name,
            email: email,
            address: address._id //Adress ka id dena parega 
        });
        await user1.save();


        // Kuch aissa data dikhega (adress ke jagah id_ aa jayega oska )
        // Without use User1.populate
        // {
        //     "success": true,
        //         "message": "User saved",
        //             "user": {
        //         "name": "Deepak",
        //             "email": "kumar@gmail.com",
        //                 "_id": "6898d2933b06bdb9521bbbaf"
        //     }
        // }
        res.json({ success: true, message: "User saved", user: user1 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving user" });

    }
})


// Embed in Mongoose ******************
app.post('/create', async (req, res) => {

    // Yani backend handle karega ki kaise array me push karna hai.

    // const { name, email, city, village } = req.body;
    const { name, email, address } = req.body;


    // Only input pe depend karta hai (normal ek object de do )
    // Input aise dena parega 
    // "name":"Rishi",
    // "email":"Rishi@gmail.com",
    // "address":[{

    //     "city":"Gya",
    //     "village":"Rahikan"
    // }]
    if (!name || !email || !address[0]?.city || !address[0]?.village) {
        return res.json({ success: false, message: "Provide the detaisls" })
    }
    try {
        // User save karo aur adress me address daalo
        const user2 = new User1({
            name: name,
            email: email,
            address: address

        });
        await user2.save();

        res.json({ success: true, message: "User saved", user: user2 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving user" });

    }
})
app.post('/create/input', async (req, res) => {

    const { name, email, city, village } = req.body;
    if (!name || !email || !city || !village) {
        return res.json({ success: false, message: "Provide the detaisls" })
    }
    try {
        // User save karo aur adress me address daalo
        // Input aise dena hoga 
        // {
        //     "name": "Rishi01",
        //     "email": "Rishi01@gmail.com",
        //     "city": "Gya01",
        //     "village": "Rahikan01"
        // }
        const user2 = new User1({
            name: name,
            email: email,
            address: [{
                city,
                village
            }]
        });

        await user2.save();

        res.json({ success: true, message: "User saved", user: user2 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving user" });

    }
})

// To show the details of user(Agr refernce diya hai to )
app.get('/user', async (req, res) => {
    // const {email}=req.body;
    // populate() me  field ka naam dena padta hai jo tumne User schema me reference ke liye set kiya hai — model ka naam nahi.
    // const user = await User.find().populate("UserAdress")
    // const user = await User.find().populate("address")
    // Isme only city filed ayega 
    const user = await User.find().populate("address","city")



    // Agr bhut sara field persent hai osme aur mujhe e specific filed chiye 
    // 😊To agar tumhara referenced document bahut bada hai aur tumhe sirf kuch fields chahiye, to populate me select ka use karna best practice hai.

    // const user = await User.find().populate({
    //     path: "address",
    //     match: { city: "Delhi" },
    //     select: "city village -_id"
    // });

    res.json({ success: true, data: user });
})


app.listen(3000, () => {
    console.log("Listening at the port 3000");
})