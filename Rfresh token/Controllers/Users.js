const User = require("../Models/user.models")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const Sign = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: true, message: "All the field are require" })
        }

        const haspassword = await bcrypt.hash(password, 10);
        console.log(haspassword);

        const user1 = new User({
            username: username,
            email: email,
            password: haspassword
        });
        await user1.save();

        // Generate the token 
        const token = await jwt.sign({ name: username, email: email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: 10 });

        // Refresh token generate karne ke liye token ko store karna parega 

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true if https
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.json({ success: true, message: "Sucessfull", data: user1 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log("Error:", error.message);

    }
}

// // Login karne ke baad hi refresh token store karenge n ?
// const login = async (req, res) => {
//     try {

//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(400).json({ success: true, message: "All the field are require" })
//         }

//         // Find the user
//         // =>isi me n login karne ke baad ek token generate karke osme save kar denge  
//         const userData = await User.findOne({ email });


//         if (!userData)
//             return res.status(400).json({ success: false, message: "User not found" });
//         console.log(userData);

//         const ismatched = await bcrypt.compare(password, userData.password);
//         if (!ismatched)
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });


//         // Generate Access token (Short live )
//         const token = await jwt.sign({ name: username, email: email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: 10 });

//         // Generate Refresh  token (Long live)
//         const refreshToken = await jwt.sign({ name: username, email: email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: "7d" });


//         // Create the refresh token and save into db (update the value in db )
//         userData.refreshToken=refreshToken;
//         await userData.save();



//         // Send the cookies to the user 
//         res.cookie("token", token, {
//             httpOnly: true,
//             sameSite: "strict",
//             maxAge: 15 * 60 * 1000
//         });



//         // Send the refresh token also 
//          res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             sameSite: "strict",
//             maxAge: 7*24*60 * 60 * 1000 //For 7days
//         });


//         res.status(200).json({ success: true, message: "Login successfull", data: userData });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server Error" });
//         console.log("Error:", error.message);

//     }
// }

const login = async (req, res) => {
    try {

        const { username, email, password, device } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: true, message: "All the field are require" })
        }

        // Find the user
        // =>isi me n login karne ke baad ek token generate karke osme save kar denge  
        const userData = await User.findOne({ email });


        if (!userData)
            return res.status(400).json({ success: false, message: "User not found" });
        console.log(userData);

        const ismatched = await bcrypt.compare(password, userData.password);
        if (!ismatched)
            return res.status(400).json({ success: false, message: "Invalid Credentials" });


        // Generate Access token (Short live )
        const token = await jwt.sign({ name: username, email: email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: 10 });

        // Generate Refresh  token (Long live)
        const refreshToken = await jwt.sign({ name: username, email: email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: "7d" });


        // Create the refresh token and save into db (update the value in db )
        // =>Model ke hisab se bhejna prega token ko 



        // Model me ek object bhejna parega according to our model 
        const refreshTokenObj = {
            token: refreshToken,
            createdAt: Date.now(),
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            device: device
        }


        // User me tum refresh token ka object save karo 
        // userData.refreshToken=refreshTokenObj; //Problem ye hai ki jitna bar execute karenge token overwrite kar dega ye 


        // userData.refreshToken.push(refreshTokenObj); //Ye  multidevice handle kar lega 
        userData.refreshToken = [refreshTokenObj];  //Ye only ek hi token rakhega 
        await userData.save();



        // Send the cookies to the user 
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });



        // Send the refresh token also 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //For 7days
        });


        res.status(200).json({ success: true, message: "Login successfull", data: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log("Error:", error.message);

    }
}


const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Provide cookie" })

        }

        const payload = jwt.verify(refreshToken, "Newsexrejaknjf2osi");
        console.log(payload);


        const user =await User.findOne({ email: payload.email });
        if (!user) return res.status(404).json({ message: "User not found " });


        // storedToken to verify karenge ki match to kar reha hai n 
        const storedToken = user.refreshToken?.[0];
        if (!storedToken || storedToken.token !== refreshToken) {
            return res.status(403).json({ message: "Refresh token does not match " });
        }

        // Check karenge db ki storedtoken bhi expire to nahi hai 
        if (storedToken.expiry < Date.now()) {
            // Agr ye true hua to token ko hata denge 
            user.refreshToken = [];
            await user.save();
            return res.json({ message: "Token is expire " });
        }

        // Create new Token 
        // 1.Access Token 
        const newAccessToken = jwt.sign({ name: user.username, email: user.email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: "15m" })


        // 2.Refresh Token 
        const newRefreshToken = jwt.sign({ name: user.username, email: user.email }, process.env.SECRET_KEY || "Newsexrejaknjf2osi", { expiresIn: "7d" });


        // save the refresh token in db 
        const newrefreshTokenObj = {
            token: newRefreshToken,
            createdAt: Date.now(),
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            device: "Single device"
        }

        user.refreshToken=[newrefreshTokenObj]
        await user.save();


        // send the refresh and Access token in Cookies 
        res.cookie("token", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //For 7days
        });

        res.status(200).json({ success: true, message: "Token renewed Sucessfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log("Error:", error.message);
    }
}

module.exports = { Sign, login ,refresh};


