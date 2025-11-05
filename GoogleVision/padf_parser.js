// import fs from "fs";
// import pdfParse from "pdf-parse";

// // Absolute path
// const filePath = "D:/Backend/BackendSelf/GoogleVision/Aadhar_01.pdf";

// if (!fs.existsSync(filePath)) {
//     console.error("File not found:", filePath);
//     process.exit(1);
// }

// const dataBuffer = fs.readFileSync(filePath);

// pdfParse(dataBuffer).then(data => {
//     console.log(data.text);
// }).catch(err => {
//     console.error("PDF parsing error:", err);
// });




// const pdfParser = require('pdf-parser');

// const PDF_PATH = 'Aadhar_01.pdf';

// pdfParser.pdf2json(PDF_PATH, function (error, pdf) {
//     if (error) {
//         console.log("Error:", error);
//     } else {
//         let fullText = '';

//         // Loop through all pages
//         pdf.pages.forEach(page => {
//             // Loop through all text objects in a page
//             page.texts.forEach(textObj => {
//                 // textObj.text is URI encoded, so decode it
//                 fullText += decodeURIComponent(textObj.text) + ' ';
//             });
//             fullText += '\n'; // new line after each page
//         });

//         console.log(fullText);
//     }
// });



// import fs from "fs";
// import pdfParse from "pdf-parse";

// const dataBuffer = fs.readFileSync("Aadhar_01.pdf");
// console.log(dataBuffer);

// pdfParse(dataBuffer).then(data => {
//     console.log(data.text); // Hindi text bhi properly show hoga
// }).catch(err => {
//     console.error("PDF parsing error:", err);
// });





// const fs = require('fs');
// const pdf = require('pdf-parse');

// let dataBuffer = fs.readFileSync('Aadhar_01.pdf');

// pdf(dataBuffer).then(function (data) {

//     // number of pages
//     console.log(data.numpages);
//     // number of rendered pages
//     console.log(data.numrender);
//     // PDF info
//     console.log(data.info);
//     // PDF metadata
//     console.log(data.metadata);
//     // PDF.js version
//     // check https://mozilla.github.io/pdf.js/getting_started/
//     console.log(data.version);
//     // PDF text
//     console.log(data.text);

// });









const http = require("http");
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Aadhar_01.pdf');

const server = http.createServer((req, res) => {
    pdf(dataBuffer).then(function (data) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<pre>${data.text}</pre>`);
    }).catch(err => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Error parsing PDF: " + err.message);
    });
});

server.listen(3000, () => {
    console.log("Server is listening at port number 3000");
});



