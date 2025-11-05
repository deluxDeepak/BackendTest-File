# WebRTC Complete Guide

## What is WebRTC?

**WebRTC (Web Real-Time Communication)** is a technology that enables **peer-to-peer audio, video, and data sharing** directly between browsers without needing a server in the middle (after initial connection setup).

### Key Features:
- **Real-time audio/video communication**
- **Peer-to-peer connection** (P2P)
- **Low latency**
- **Built into modern browsers**
- **No plugins required**

---

## HTTP vs HTTPS in WebRTC

| Feature | HTTP | HTTPS |
|---------|------|-------|
| Security | Not secure | Encrypted (SSL/TLS) |
| getUserMedia() | ❌ Not allowed | ✅ Required |
| WebRTC | ❌ Blocked by browsers | ✅ Works |
| Port | 80 | 443 |

**⚠️ Important:** WebRTC requires HTTPS for security. Browsers block `getUserMedia()` on HTTP.

---

## Why Use WebRTC?

- **Video/Audio Calls:** Zoom, Google Meet, WhatsApp Web
- **Screen Sharing:** Remote desktop, presentations
- **Live Streaming:** Twitch, YouTube Live
- **File Sharing:** Direct P2P file transfer
- **Gaming:** Multiplayer real-time games
- **IoT:** Real-time device communication

---

## When to Use WebRTC?

✅ **Use WebRTC for:**
- Video conferencing
- Voice calls
- Screen sharing
- Live streaming
- Real-time data transfer
- P2P file sharing

❌ **Don't Use WebRTC for:**
- Simple messaging (use WebSocket)
- File uploads to server
- One-way video streaming (use HLS/DASH)
- Non-real-time communication

---

## WebRTC Architecture

```
CLIENT1 (Caller)  ←→  Signaling Server  ←→  CLIENT2 (Receiver)
       ↓                                           ↓
       └──────────── P2P Connection ───────────────┘
              (Audio/Video/Data flows here)
```

### Key Components:

1. **Signaling Server:** Helps clients find each other (uses Socket.io)
2. **STUN Server:** Finds your public IP address
3. **TURN Server:** Relay server when P2P fails (firewall/NAT issues)
4. **ICE Candidates:** Network paths for connection

---

## How WebRTC Works (Step-by-Step)

### Phase 1: CLIENT1 (Caller/Offerer) Setup

1. **Get User Media:**
   ```javascript
   const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
   ```

2. **Create Peer Connection:**
   ```javascript
   const peerConnection = new RTCPeerConnection({
       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
   });
   ```

3. **Add Local Stream Tracks:**
   ```javascript
   localStream.getTracks().forEach(track => {
       peerConnection.addTrack(track, localStream);
   });
   ```

4. **Create Offer:**
   ```javascript
   const offer = await peerConnection.createOffer();
   await peerConnection.setLocalDescription(offer);
   ```

5. **Send Offer to Signaling Server:**
   ```javascript
   socket.emit('offer', offer);
   ```

6. **Collect ICE Candidates:**
   ```javascript
   peerConnection.onicecandidate = (event) => {
       if (event.candidate) {
           socket.emit('ice-candidate', event.candidate);
       }
   };
   ```

### Phase 2: Signaling Server (Socket.io)

```javascript
// Hold offer until CLIENT2 connects
socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
});

// Forward ICE candidates
socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
});
```

### Phase 3: CLIENT2 (Receiver/Answerer) Setup

7. **Receive Offer:**
   ```javascript
   socket.on('offer', async (offer) => {
       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
   });
   ```

8. **Get User Media:**
   ```javascript
   const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
   ```

9. **Add Local Stream Tracks:**
   ```javascript
   localStream.getTracks().forEach(track => {
       peerConnection.addTrack(track, localStream);
   });
   ```

10. **Create Answer:**
    ```javascript
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    ```

11. **Send Answer to Signaling Server:**
    ```javascript
    socket.emit('answer', answer);
    ```

12. **Collect ICE Candidates:**
    ```javascript
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate);
        }
    };
    ```

### Phase 4: Connection Established

13. **CLIENT1 Receives Answer:**
    ```javascript
    socket.on('answer', async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });
    ```

14. **Both Clients Receive ICE Candidates:**
    ```javascript
    socket.on('ice-candidate', async (candidate) => {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
    ```

15. **Display Remote Stream:**
    ```javascript
    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };
    ```

---

## Setting Up HTTPS with SSL/TLS Certificates

### Why HTTPS is Required?

- **Security:** Encrypts data between client and server
- **Browser Requirement:** `getUserMedia()` requires HTTPS
- **WebRTC Support:** Most WebRTC features need HTTPS

### Option 1: Using mkcert (Development Only)

**mkcert** creates locally-trusted development certificates.

#### Installation & Setup:

```bash
# Install mkcert globally
npm install -g mkcert

# Create Certificate Authority (CA)
mkcert create-ca

# Create SSL Certificate
mkcert create-cert

# Files generated:
# - ca.crt, ca.key (Certificate Authority)
# - cert.crt, cert.key (SSL Certificate)
```

#### What These Files Do:

| File | Purpose |
|------|---------|
| `ca.crt` | Certificate Authority public certificate |
| `ca.key` | Certificate Authority private key |
| `cert.crt` | SSL certificate for your domain |
| `cert.key` | Private key for SSL certificate |

### Option 2: Using OpenSSL (Alternative)

```bash
# Generate self-signed certificate
openssl req -nodes -new -x509 -keyout cert.key -out cert.crt
```

### Configuring Server with SSL

```javascript
// filepath: server.js
const express = require('express');
const https = require('https');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();

// Load SSL certificates
const options = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt')
};

// Create HTTPS server
const server = https.createServer(options, app);
const io = socketio(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Socket listeners here
});

server.listen(3000, () => {
    console.log('🔒 HTTPS Server running at https://localhost:3000');
});
```

### Trusting Self-Signed Certificates

**For Chrome/Edge:**
1. Navigate to `chrome://flags/#allow-insecure-localhost`
2. Enable "Allow invalid certificates for resources loaded from localhost"
3. Restart browser

**For Firefox:**
1. Go to `https://localhost:3000`
2. Click "Advanced" → "Accept the Risk and Continue"

**For Production:**
- Use **Let's Encrypt** (free SSL certificates)
- Use **AWS Certificate Manager**
- Use **Cloudflare SSL**

---

## Complete Code Example

### Server Setup

```javascript
// filepath: server.js
const express = require('express');
const https = require('https');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();

const options = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt')
};

const server = https.createServer(options, app);
const io = socketio(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('🔒 HTTPS Server running at https://localhost:3000');
});
```

### Client Setup

```html
<!-- filepath: index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>WebRTC Video Chat</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>WebRTC Video Chat</h1>
    
    <div class="video-container">
        <video id="localVideo" autoplay muted playsinline></video>
        <video id="remoteVideo" autoplay playsinline></video>
    </div>

    <button id="startButton">Start Call</button>

    <script src="/socket.io/socket.io.js"></script>
    <script src="scripts.js"></script>
</body>
</html>
```

```javascript
// filepath: scripts.js
const socket = io();

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');

// Get user media
async function getUserMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Create peer connection
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(servers);

    // Add local stream tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate);
        }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };
}

// Create and send offer
async function createOffer() {
    createPeerConnection();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', offer);
}

// Handle incoming offer
socket.on('offer', async (offer) => {
    if (!peerConnection) {
        createPeerConnection();
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('answer', answer);
});

// Handle incoming answer
socket.on('answer', async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Handle ICE candidates
socket.on('ice-candidate', async (candidate) => {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
});

// Start button
startButton.onclick = async () => {
    await getUserMedia();
    await createOffer();
    startButton.disabled = true;
};
```

---

## Installation & Running

### Prerequisites

```bash
npm install express socket.io
npm install -g mkcert
```

### Setup SSL Certificates

```bash
# Create certificates
mkcert create-ca
mkcert create-cert
```

### Start Server

```bash
node server.js
```

### Access Application

```
https://localhost:3000
```

Open in **two different browser tabs** or **two different devices** on the same network.

---

## Advanced Features

### 1. Screen Sharing

```javascript
async function shareScreen() {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
    });

    const videoTrack = screenStream.getVideoTracks()[0];
    const sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
    
    sender.replaceTrack(videoTrack);
}
```

### 2. Mute/Unmute Audio

```javascript
function toggleAudio() {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
}
```

### 3. Toggle Video

```javascript
function toggleVideo() {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
}
```

### 4. Data Channel (Text/File Transfer)

```javascript
// Create data channel
const dataChannel = peerConnection.createDataChannel('chat');

dataChannel.onmessage = (event) => {
    console.log('Message received:', event.data);
};

// Send message
dataChannel.send('Hello!');
```

---

## STUN vs TURN Servers

### STUN (Session Traversal Utilities for NAT)

- **Purpose:** Finds your public IP address
- **Free:** Google provides free STUN servers
- **Usage:**
  ```javascript
  { urls: 'stun:stun.l.google.com:19302' }
  ```

### TURN (Traversal Using Relays around NAT)

- **Purpose:** Relays traffic when P2P fails
- **Not Free:** Requires hosting or paid service
- **Usage:**
  ```javascript
  {
      urls: 'turn:your-turn-server.com',
      username: 'user',
      credential: 'pass'
  }
  ```

### Free TURN Server Providers:
- **Metered.ca** (Free tier available)
- **Twilio** (Free credits)
- **Xirsys** (Free tier)

---

## Common Issues & Solutions

### Issue: getUserMedia() not working

**Solution:** Make sure you're using HTTPS

```javascript
// Check if HTTPS
if (location.protocol !== 'https:') {
    console.error('HTTPS required for getUserMedia()');
}
```

### Issue: ICE connection failed

**Solution:** Add TURN servers

```javascript
const servers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:your-turn-server.com',
            username: 'user',
            credential: 'pass'
        }
    ]
};
```

### Issue: Video not displaying

**Solution:** Check autoplay policy

```javascript
remoteVideo.autoplay = true;
remoteVideo.muted = true; // Mute for autoplay to work
```

---

## Best Practices

1. **Always handle errors:**
   ```javascript
   try {
       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
   } catch (error) {
       console.error('Camera access denied:', error);
   }
   ```

2. **Close connections properly:**
   ```javascript
   function closeConnection() {
       peerConnection.close();
       localStream.getTracks().forEach(track => track.stop());
   }
   ```

3. **Use TURN servers for production:**
   - STUN alone fails for ~8% of users behind strict firewalls

4. **Implement connection state handling:**
   ```javascript
   peerConnection.onconnectionstatechange = () => {
       console.log('Connection state:', peerConnection.connectionState);
   };
   ```

---

## Production Deployment

### Using Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates location
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Update Server for Production

```javascript
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};
```

---

## Summary

- **WebRTC = Peer-to-peer real-time communication**
- **Requires HTTPS for security**
- **Uses signaling server for initial connection**
- **STUN finds public IP, TURN relays when P2P fails**
- **Perfect for video calls, screen sharing, live streaming**

---

## Useful Resources

- [WebRTC Official Docs](https://webrtc.org/)
- [MDN WebRTC Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Google STUN Servers](stun:stun.l.google.com:19302)
- [Socket.io Docs](https://socket.io/docs/)

---

## Running the Project

```bash
# Install dependencies
npm install

# Generate certificates (development only)
mkcert create-ca
mkcert create-cert

# Start server
node server.js

# Open browser
# https://localhost:3000
```

**🎉 Open in two tabs to test video chat!**