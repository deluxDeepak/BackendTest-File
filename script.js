// Constraints: request both video and audio
const constraints = {
    audio: {
        // channelCount: 1,       // mono (voice ke liye best)
        // sampleRate: 16000,     // speech optimized
        // sampleSize: 16,        // normal bit depth
        // noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true
    },
    video: {
        width: { ideal: 1800 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }, //30fps,
        facingMode: "user",
        facingMode: "environment",
        aspectratio: 1.77777779
    }
};


// Screen sharing on karke osko ek video Element me dalna hoga nahi to ye nhai chalega 
function startScreenShare() {
  navigator.mediaDevices.getDisplayMedia()
    .then(displayStream => {
        console.log("All tracks ",displayStream.getTracks());
      document.getElementById('displayVideo').srcObject = displayStream;
    })
    .catch(err => console.error("Error:", err));
}








// ===================Geolocation =================
navigator.geolocation.getCurrentPosition((position)=>{
    console.log("Longitude",position.coords.longitude);
    console.log("Latitude",position.coords.longitude);
    console.log("Position Object",position);
})



// Function to get media devices using async/await
async function startMedia() {
    try {


        // navigator.mediaDevices.getUserMedia(constraints) ye ek promise return karta hai isliye awit use kiya gya hai 
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // console.log(navigator.geolocation);



        // ye ek promise return karta hai and resolve with  array 
        // ->return the deives connected with this 
        // await navigator.mediaDevices.enumerateDevices()
        //     .then(devices => console.log(devices))
        //     .catch(error => console.log(error));

        // Mere device me do camera hai 
        // ->Connected device nikal sakte hai aur os me camera nikala hai yehan pe 

        function getConnectedDevices(type, callback) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    const filtered = devices.filter(device => device.kind === type);
                    callback(filtered);
                });
        }
        getConnectedDevices('videoinput', cameras => console.log('Cameras found', cameras));

        // Agar await use karna hai to .then() nahi likhna:
        // Agar .then() use karna hai to await ki zaroorat nahi hai:
        // ->Screen share karne ke liye hota hai 
        // navigator.mediaDevices.getDisplayMedia()
        //     .then(despaly => console.log("Display Device:", despaly))
        //     .catch(err => console.error("Error:", err));









        console.log("Number of Cpu core in your computer is: ", navigator.hardwareConcurrency);

        // Fallback: Agar browser support nahi karta → undefined.
        console.log("Approximate RAM in your computer is ", navigator.deviceMemory)


        // console.log(navigator);
        console.log('Got MediaStream:', stream);







        // Display the video stream in the <video> element
        const videoElement = document.getElementById('video');


        // srcObject isko directly <video> element se link kar deta hai.
        // Browser automatically playback start kar deta hai.
        // A poperty of HTML mediaElement 
        videoElement.srcObject = stream


        // Optional: you can also access audio tracks
        const audioTracks = stream.getAudioTracks();
        console.log('Audio Tracks:', audioTracks);

    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera or microphone. Check permissions.');
    }
}

// Start media on page load
startMedia();


// Optional: listen for device changes
// ye ek event handler hai bus 
navigator.mediaDevices.ondevicechange = () => {
    console.log('Media devices changed!');
};