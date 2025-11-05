// Update Create and Delete ka logic hoga 
const User = require('../Model/userModel')
const uservalidate = require('../Validator/Uservalidator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Create logic 
exports.createuser = async (req, res) => {
    // Agar data.save() fail ho jaye (e.g. validation error), to server crash kar sakta hai. Humesha try-catch block use karo.
    try {
        // First check karenge ki valid cheeze to de reha hai 
        uservalidate(req.body)

        const data = new User(req.body);
        data.password = await bcrypt.hash(req.body.password, 10);


        const created_data = await data.save();
        res.status(201).json({ message: "Created user Successfully", data: created_data })

    } catch (error) {
        // console.error('Error creating user:', error.message);
        res.send('Error creating user:' + error.message);
    }
}

// User login logic 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password)
            return res.status(400).send("User Not Valid");

        // Find user
        const data_user = await User.findOne({ email });
        // console.log(data_user);


        if (!data_user)
            return res.status(404).send("User does not exist with this email");
        // Match password
        const isPasswordMatch = await bcrypt.compare(password, data_user.password);
        
        // DEBUG LOG (Temporary)
        // console.log("Entered password:", password);
        // console.log("DB stored password:", data_user.password);


        if (!isPasswordMatch)
            return res.status(401).send("Password not matched! Try again");

        // Wetoken generate karke send karenge 
        const token = jwt.sign({ email, data: data_user._id }, "Secretkey124", { expiresIn: 10 });
        res.cookie("token", token);


        // Successful login(Ye token mujhe client side server pe store karana hoga isliye response me token bhej rehe hai )
        return res.status(200).json({
            message: "Login successful",
            token:token,
            email:email
        });

    } catch (error) {
        console.error("Login error:", error.message);
    }
};

// Jab data fetch karna hoga user ko  tab  verify karenge ki sahi token hai ya nahi 
exports.info = async (req, res) => {
    try {
        // console.log(req.cookies); //undefined ata hai bina cookies parser ke 

        // Pehle token verify ho 
        const token=req.cookies.token;
        const returnPayload = jwt.verify(token, "Secretkey124");
        console.log("Verified payload:",returnPayload); //Expire hone ke baad nahi ayega kuch bhi 




        const data = await User.find()
        if (!data || data.length === 0) {
            return res.status(404).send("No users in DB");
        }
        res.status(200).send({ message: "Dta fetch successfully", data: data })


    } catch (error) {
        res.send("Error:"+error.message);
    }
}


