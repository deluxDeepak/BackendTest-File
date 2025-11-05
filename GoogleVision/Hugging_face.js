// HUGGING_FACE_TOKEN_REMOVED

// HUGGING_FACE_TOKEN_REMOVED



// import fs from "fs";
// import fetch from "node-fetch";

// const API_TOKEN = "HUGGING_FACE_TOKEN_REMOVED"; // Hugging Face API token
// const MODEL = "microsoft/VibeVoice-1.5b";  // Model name
// const TEXT = "नमस्ते, यह VibeVoice मॉडल का टेस्ट है।";

// async function synthesize() {
//     const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${API_TOKEN}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ inputs: TEXT })
//     });

//     if (!response.ok) {
//         console.error("Error:", response.statusText);
//         return;
//     }

//     const buffer = await response.arrayBuffer();
//     fs.writeFileSync("output.wav", Buffer.from(buffer));
//     console.log("Audio saved as output.wav");
// }

// synthesize();





import fs from "fs";
import fetch from "node-fetch";

const API_TOKEN = "HUGGING_FACE_TOKEN_REMOVED";
const MODEL = "espnet/kan-bayashi_ljspeech_vits";
const TEXT = "Hello Deepak, this is a TTS test.";

async function synthesize() {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputs: TEXT,
            options: { use_cache: false, wait_for_model: true }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Error:", response.statusText, errText);
        return;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync("output.wav", Buffer.from(buffer));
    console.log("Audio saved as output.wav");
}

synthesize();
