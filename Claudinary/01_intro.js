const express = require('express');
const multer = require('multer');
const cloudinary = require('./config')

const app = express();
app.use(express.json());

// multer create karna parega (req,res,file )=>multer deta hai 
const upload = multer({ dest: 'uploads/' });


app.post('/', upload.single('myfile'), async (req, res) => {
    // Datbase se connect karna parega claudinary ke 
    // await cloudinary.uploader.upload(path, Option)
    // path=>image ko jo path hai wo dena parega 

    // Option me object de sakte hai (power to control kya karna hai file ke sath ya media )
    // await cloudinary.uploader.upload(req.file.path, {
    //     folder:'optional'

    // })   =>ye return karta hai url khan store hua hai (object deta hai )

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'optional'
        })
        console.log("Connected Successfully");
        
        console.log(result);

        res.json({
            message: "Image uploaded ",
            url: result.secure_url
        })

    } catch (error) {
        // res.send() ek hi argument accept karta hai. Tumhe object banana chahiye:
        // res.send("Upload fail" ,error.message);
        res.send("Upload fail" +error.message);

    }


})

app.listen(3000, () => {
    console.log("Listining at port 3000");
})

