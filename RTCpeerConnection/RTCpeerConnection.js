
// Ye normal with default configuration hai isme configuration dena prega 
// const peer=new RTCPeerConnection();
// console.log(peer);

// Advanced configurations might include custom certificate handling for enhanced security, specific ICE transport policies to control candidate types, and connection constraints for bandwidth management.
// const rtcConfig = {
//   iceServers: [
//     {
//       urls: 'stun:stun.1.google.com:19302'
//     },
//   ],
// };

// const peerConnection=new RTCPeerConnection(rtcConfig);
// console.log(peerConnection);


// // Jab connection break ho jaye ya unstable ho (network switch, wifi → mobile data, etc.)
// // iceRestart ek naya offer banata hai jisme naye upar-down IP/ports aate hain.
// peerConnection.createOffer({iceRestart:true})










const rtcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.1.google.com:19302'
    },
  ],
};
const localPeerConnection=new RTCPeerConnection(rtcConfig);


const offerOptions = {
    iceRestart: true,
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

// ****************Creating SDP offer **********************
const offer = await localPeerConnection.createOffer(offerOptions);
console.log(offer);

// After creating the SDP offer, you should set the message to the peer connection as a local description and make it clear that your local peer connection initiates the WebRTC connection to a remote peer:
await localPeerConnection.setLocalDescription(offer)





// Let's assume the remote peer received an SDP offer from a signaling server. Then the remote peer connection should set the SDP offer message as a remote description and make it clear that the remote peer connection received the SDP offer message:
// await remotePeerConnection.setRemoteDescription(offer);


// ****************Creating SDP Answer **********************
const remoteConnection=new RTCPeerConnection(rtcConfig)
remoteConnection.createAnswer()









