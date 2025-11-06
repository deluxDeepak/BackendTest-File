# ngrok Setup

This project uses your globally installed ngrok to create public tunnels to your local development server.

## Prerequisites

Make sure ngrok is installed globally:
```bash
npm install -g ngrok
# or
choco install ngrok  # Windows with Chocolatey
```

## Usage

1. **Start the development server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Start ngrok tunnel** (in another terminal):
   ```bash
   npm run ngrok
   ```

   Or directly:
   ```bash
   ngrok http 5173
   ```

This will create a public URL that tunnels to your local Vite dev server (port 5173).

## What you'll see

The ngrok dashboard will show:
- **Forwarding URL**: https://xxxx-xx-xx-xxx-xxx.ngrok-free.app → http://localhost:5173
- **Web Interface**: http://127.0.0.1:4040 (inspect traffic)

## Notes

- The ngrok tunnel URL is temporary and changes each time you restart
- Keep both terminals running (dev server + ngrok) while working
- Free ngrok accounts may show a warning page before accessing your site
- Access http://localhost:4040 to see request logs and inspect traffic

## Authentication (Optional)

For better features and persistent domains:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken
