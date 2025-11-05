// file: ocr.js
import vision from "@google-cloud/vision";


// Google Vision client banate hain
const client = new vision.ImageAnnotatorClient({
    keyFilename: "./keyGoogle.json", // yaha tumhara service account JSON file ka path
});


async function runOCR(imagePath) {

    const [result] = await client.textDetection(imagePath);

    const detections = result.textAnnotations;
    const extractedText = detections[0] ? detections[0].description : "";

    console.log("Extracted Text:\n", extractedText);


















    // // Document OCR (zyada accurate Aadhaar/PAN ke liye)
    // const [result] = await client.documentTextDetection(imagePath);
    // console.log(result);



    // const detections = result.textAnnotations;
    // console.log(detections);


    // const extractedText = detections[0] ? detections[0].description : "";

    // console.log("Extracted Text:\n", extractedText);


    // // Aadhaar Regex (XXXX XXXX XXXX format)
    // const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
    // if (aadhaarRegex.test(extractedText)) {
    //     console.log("✅ Aadhaar Found:", extractedText.match(aadhaarRegex)[0]);
    // }

    // // PAN Regex (ABCDE1234F format)
    // const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/;
    // if (panRegex.test(extractedText)) {
    //     console.log("✅ PAN Found:", extractedText.match(panRegex)[0]);
    // }
}

runOCR("./text_note01.jpg");
