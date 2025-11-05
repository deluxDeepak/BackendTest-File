// file: ocr.js
import Tesseract from "tesseract.js";

async function runOCR(imagePath) {
  console.log("⏳ OCR processing...");

  const { data: { text } } = await Tesseract.recognize(
    imagePath,
    "eng",   // language
  );

  console.log("📄 Extracted Text:\n", text);



  // Aadhaar Regex (XXXX XXXX XXXX format)
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
  if (aadhaarRegex.test(text)) {
    console.log("✅ Aadhaar Found:", text.match(aadhaarRegex)[0]);
  }

  // PAN Regex (ABCDE1234F format)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/;
  if (panRegex.test(text)) {
    console.log("✅ PAN Found:", text.match(panRegex)[0]);
  }
}

runOCR("./text_note03.jpg");
