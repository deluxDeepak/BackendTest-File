# Docker Quick Start Guide

## 🚀 Quick Commands

### Build and Run
```bash
# Navigate to project
cd d:\Backend\BackendSelf\DockerBasic

# Build Docker image
docker build -t my-vite-app .

# Run container
docker run -d -p 8080:4173 --name my-vite-app-container my-vite-app

# Open browser
start http://localhost:8080
```

### View Status
```bash
# List running containers
docker ps

# View logs
docker logs my-vite-app-container

# Follow logs (real-time)
docker logs -f my-vite-app-container
```

### Stop and Clean Up
```bash
# Stop container
docker stop my-vite-app-container

# Remove container
docker rm my-vite-app-container

# Remove image
docker rmi my-vite-app

# Clean everything
docker stop my-vite-app-container && docker rm my-vite-app-container && docker rmi my-vite-app
```

---

## Using Docker Compose (Recommended)

### Start All Services
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## Troubleshooting

### Port Already in Use
```bash
# Use different port
docker run -d -p 8081:4173 --name my-vite-app-container my-vite-app
```

### Rebuild Image
```bash
# Stop and remove container
docker stop my-vite-app-container
docker rm my-vite-app-container

# Remove image
docker rmi my-vite-app

# Rebuild
docker build --no-cache -t my-vite-app .

# Run again
docker run -d -p 8080:4173 --name my-vite-app-container my-vite-app
```

### View Container Details
```bash
# Inspect container
docker inspect my-vite-app-container

# Execute command inside container
docker exec -it my-vite-app-container sh

# View resource usage
docker stats my-vite-app-container
```

---

## ✅ Current Status

✅ Docker image built: `my-vite-app`  
✅ Container running: `my-vite-app-container`  
✅ Application accessible at: http://localhost:8080  
✅ Container port: 4173  
✅ Host port: 8080  

---

For complete documentation, see: **DOCKER_GUIDE.md**
