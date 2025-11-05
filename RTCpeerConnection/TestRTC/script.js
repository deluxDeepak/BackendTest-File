let localStream, pc1, pc2;

// UI buttons
const callPc1Button = document.getElementById('callPc1');
// callPc1Button.addEventListener("click",attachLocalMedia);
// Isme await ka use karna better hai, kyunki pehle media attach hona chahiye, tabhi peerConnection() me localStream available rahega.
callPc1Button.addEventListener('click',async()=>{
    await attachLocalMedia(); // pehle camera/mic start hoga
    await peerConnection();     //Fir peer connection banega 

})


const callPc2Button = document.getElementById('callPc2');
const disconnectButton = document.getElementById('disconnect');

// Video elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Media constraints 
const constraints = {
    audio: {
        channelCount: 1,        // mono (voice ke liye best)
        sampleRate: 16000,      // optimized for speech
        sampleSize: 16,         // bit depth
        noiseSuppression: true, // background noise kam karega
        echoCancellation: true, // mic+speaker feedback avoid karega
        autoGainControl: true   // volume auto adjust karega
    },
    video: {
        width: { ideal: 1800 },   // prefered resolution
        height: { ideal: 720 },
        frameRate: { ideal: 30 }, // 30 fps smooth video
        facingMode: "user",       // front camera
        // ⚠️ Note: tumne do bar `facingMode` likha hai → 
        // "environment" wala overwrite ho jayega, sirf last value count hoti hai
        aspectratio: 1.77777779   // widescreen (16:9 approx)
    }
};

// ICE server configuration add turn server also 
const rtcConfig = {
    iceServers: [
        {
            urls: 'stun:stun.1.google.com:19302' // public STUN server
        },
    ],
};

// Genric function to catch the error 
function onCatch(e) {
    console.error("Error:", e);
}


// Attach the local media (mic + camera)
async function attachLocalMedia() { // typo: tumne "attact" likha tha

    // jisko call laga diya firse osi buttonpe click nahi kar sakte hai 
    callPc1Button.disabled = true; // self-call ka button disable

    try {
        // mic + camera access lene ka prompt 
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // apna video screen pe show karo
        localVideo.srcObject = stream;
        localStream = stream; // 🔹 yeh zaroori hai baad me track add karne ke liye

        callPc2Button.disabled = false; // ab doosre peer ko call kar sakte ho
    } catch (error) {
        console.log("Error is:", error);
        alert("Error: " + error.message); // template string ka use karo 
    }
}



// Create peer connections
async function peerConnection() {
    pc1 = new RTCPeerConnection(rtcConfig);
    pc2 = new RTCPeerConnection(rtcConfig);

    // 🔹 Local stream ke tracks pc1 me add karna bhool gaye ho
    // warna audio/video nahi bhejega
    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    try {
        console.log('pc1 createOffer start');

        // Offer create karte waqt audio/video demand karna
        const offer = await pc1.createOffer({
            iceRestart: true,
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });

        // console.log(offer); ye ek object deta hai jisme sdp method ya property hota hai 
        // Offer handle karna
        await onCreateOfferSuccess(offer);
    } catch (e) {
        onCatch(e);
    }
}

// Handle offer (pc1 → pc2)
async function onCreateOfferSuccess(desc) {
    console.log(`Offer from pc1\nsdp: ${desc.sdp}`);

    try {
        await pc1.setLocalDescription(desc);
    } catch (e) {
        onCatch(e);
    }

    try {
        await pc2.setRemoteDescription(desc);
    } catch (e) {
        onCatch(e);
    }

    try {
        // pc2 se answer create karna
        const answer = await pc2.createAnswer();
        await onCreateAnswerSuccess(answer);
    } catch (e) {
        onCatch(e);
    }
}

// Handle answer (pc2 → pc1)
async function onCreateAnswerSuccess(desc) {
    try {
        await pc2.setLocalDescription(desc);
    } catch (e) {
        onCatch(e);
    }

    try {
        await pc1.setRemoteDescription(desc);
    } catch (e) {
        onCatch(e);
    }
}
