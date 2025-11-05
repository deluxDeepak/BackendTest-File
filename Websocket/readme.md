# WebSocket Guide

## What is WebSocket?

WebSocket is a **real-time, bi-directional communication protocol** that allows **full-duplex communication** between client and server over a single TCP connection.

### Key Differences: HTTP vs WebSocket

| Feature       | HTTP                            | WebSocket                       |
| ------------- | ------------------------------- | ------------------------------- |
| Connection    | Request-Response (One-way)      | Persistent (Two-way)            |
| Communication | Client asks, server responds    | Both can send anytime           |
| Overhead      | High (new connection each time) | Low (one persistent connection) |
| Use Case      | Normal web requests             | Real-time updates               |

---

## Why Use WebSocket?

- **Real-time Communication:** Instant data exchange without polling.
- **Low Latency:** No need to repeatedly open/close connections.
- **Efficient:** Reduces server load and bandwidth usage.
- **Bi-directional:** Both client and server can initiate communication.

---

## When to Use WebSocket?

✅ **Use WebSocket for:**

- Chat applications
- Live notifications
- Real-time dashboards
- Multiplayer games
- Live sports scores
- Stock market tickers
- Collaborative editing (Google Docs-like features)

❌ **Don't Use WebSocket for:**

- Simple REST API calls
- File uploads/downloads
- Static content serving
- One-time data fetches

---

## How to Use WebSocket with Socket.io

### Installation

```bash
npm install express socket.io
npm install nodemon --save-dev
```

### Package.json Script

```json
{
  "scripts": {
    "start": "nodemon index.js"
  }
}
```

---

## Server Setup (Node.js + Express + Socket.io)

### Basic Server

```javascript
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from Public folder
app.use(express.static("./Public"));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Listen for messages from client
  socket.on("chat message", (msg) => {
    console.log("Message from client:", msg);

    // Send to all clients (including sender)
    io.emit("chat message", msg);

    // OR Send to all except sender
    // socket.broadcast.emit('chat message', msg);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
```

---

## Client Setup (HTML + JavaScript)

```html
<!-- filepath: Public/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>WebSocket Chat</title>
  </head>
  <body>
    <h1>Chat Application</h1>

    <div id="messages"></div>
    <input id="messageInput" type="text" placeholder="Type a message..." />
    <button onclick="sendMessage()">Send</button>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();

      // Listen for messages from server
      socket.on("chat message", (msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = msg;
        document.getElementById("messages").appendChild(messageDiv);
      });

      // Send message to server
      function sendMessage() {
        const input = document.getElementById("messageInput");
        const msg = input.value;
        socket.emit("chat message", msg);
        input.value = "";
      }
    </script>
  </body>
</html>
```

---

## Advanced Features

### 1. Rooms (Group Chat)

**Server Side:**

```javascript
io.on("connection", (socket) => {
  // Join a room
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room: ${roomName}`);

    // Notify others in the room
    socket.to(roomName).emit("message", `${socket.id} joined the room`);
  });

  // Send message to specific room
  socket.on("chatMessage", ({ room, msg }) => {
    io.to(room).emit("message", `${socket.id}: ${msg}`);
  });
});
```

**Client Side:**

```javascript
// Join a room
socket.emit("joinRoom", "room1");

// Send message to room
socket.emit("chatMessage", { room: "room1", msg: "Hello everyone!" });

// Listen for room messages
socket.on("message", (msg) => {
  console.log(msg);
});
```

### 2. Broadcasting

```javascript
// Send to ALL clients (including sender)
io.emit("event", data);

// Send to ALL except sender
socket.broadcast.emit("event", data);

// Send to specific room
io.to("roomName").emit("event", data);

// Send to specific room except sender
socket.to("roomName").emit("event", data);
```

### 3. Private Messages

```javascript
// Send to specific socket ID
io.to(socketId).emit("private message", "Hello!");
```

---

## Important Socket Properties

```javascript
socket.id; // Unique socket identifier
socket.handshake; // Connection handshake details
socket.rooms; // All rooms socket is in
socket.connected; // Connection status
```

---

## Running the Application

1. **Start server:**

   ```bash
   npm start
   ```

2. **Open browser:**

   ```
   http://localhost:3000
   ```

3. **Open multiple tabs to test real-time communication**

---

## Best Practices

1. **Always handle disconnection:**

   ```javascript
   socket.on("disconnect", () => {
     // Cleanup code here
   });
   ```

2. **Use rooms for organization:**

   - Separate chat channels
   - Game sessions
   - User-specific notifications

3. **Validate data:**

   ```javascript
   socket.on("message", (msg) => {
     if (typeof msg === "string" && msg.length > 0) {
       // Process message
     }
   });
   ```

4. **Handle errors:**
   ```javascript
   socket.on("error", (error) => {
     console.error("Socket error:", error);
   });
   ```

---

## Common Issues & Solutions

### Issue: Socket.io not connecting

**Solution:** Make sure to use `http.createServer(app)` instead of just `app.listen()`

```javascript
// ❌ Wrong
const io = socketio(app);
app.listen(3000);

// ✅ Correct
const server = http.createServer(app);
const io = socketio(server);
server.listen(3000);
```

### Issue: Messages not received

**Solution:** Check event names match on client and server

```javascript
// Server
socket.emit("chat message", msg);

// Client - must use same event name
socket.on("chat message", (msg) => {});
```

---

## Summary

- **WebSocket = Real-time, two-way communication**
- **Socket.io = Library that makes WebSocket easy**
- **Use for: Chat, notifications, live updates**
- **Don't use for: Regular API calls, file transfers**

---

## Start Command

```bash
npm start
```

This will run `nodemon index.js` and auto-restart server on file changes.
