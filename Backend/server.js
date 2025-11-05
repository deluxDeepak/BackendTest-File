const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


// Ye special file jo firebase se milta hai 
const serviceAccount = require("./serviceAccountkey.json");




// Firebase ko initilize kar denge yehan se 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});




// Secretkey lenge to generate the token 
const SECRET_KEY = "MY_SECRET_KEY";





// Verify Firebase Token and create our JWT
app.post("/auth/verify", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase Token
    const decoded = await admin.auth().verifyIdToken(token);
    console.log(decoded);


    // User info from Firebase
    const userData = {
      uid: decoded.uid,
      phone: decoded.phone_number,
    };

    // TODO: Save userData in MongoDB/MySQL here

    // Generate custom JWT
    const myToken = jwt.sign(userData, SECRET_KEY, { expiresIn: "1h" });

    res.json({ success: true, token: myToken, user: userData });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
