# Docker Basic Guide

## What is Docker?

**Docker** is a platform that allows you to package, distribute, and run applications in isolated containers. Containers include everything needed to run an application: code, runtime, libraries, and dependencies.

### Key Concepts:

- **Image:** A blueprint/template for creating containers
- **Container:** A running instance of an image
- **Dockerfile:** Instructions to build a Docker image
- **Docker Hub:** Repository for sharing Docker images

---

## Why Use Docker?

✅ **Consistency:** "Works on my machine" → Works everywhere  
✅ **Isolation:** Each app runs in its own environment  
✅ **Portability:** Run anywhere (dev, staging, production)  
✅ **Efficiency:** Lightweight compared to VMs  
✅ **Scalability:** Easy to scale horizontally  

---

## When to Use Docker?

✅ **Use Docker for:**
- Microservices architecture
- CI/CD pipelines
- Development environments
- Multi-environment deployments (dev/staging/prod)
- Running multiple versions of same software

❌ **Not Ideal for:**
- Simple single-file scripts
- GUI applications (complex setup)
- High-performance computing (small overhead)

---

## Docker Installation

### Windows:
```bash
# Download and install Docker Desktop
# https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

### Linux:
```bash
# Update packages
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Verify
docker --version
```

---

## Understanding the Dockerfile

### Line-by-Line Explanation:

```dockerfile
# Step 1: Base Image
FROM node:20-alpine
```
**Why:** Starts with a lightweight Node.js image (Alpine Linux - only ~5MB)  
**Alternative:** `node:20` (full image ~900MB)

```dockerfile
# Step 2: Working Directory
WORKDIR /app
```
**Why:** Sets `/app` as the current directory inside container  
**Effect:** All subsequent commands run from this directory

```dockerfile
# Step 3: Copy Package Files
COPY package*.json ./
```
**Why:** Copy only package files first for Docker layer caching  
**Benefit:** If package.json doesn't change, npm install is cached

```dockerfile
# Step 4: Install Dependencies
RUN npm install
```
**Why:** Installs all dependencies listed in package.json  
**Note:** Runs during image build, not when container starts

```dockerfile
# Step 5: Copy Application Code
COPY . .
```
**Why:** Copy all project files to container  
**Order matters:** Done after npm install for better caching

```dockerfile
# Step 6: Build Application
RUN npm run build
```
**Why:** Creates production-optimized build  
**Output:** Vite generates files in `dist/` folder

```dockerfile
# Step 7: Expose Port
EXPOSE 4173
```
**Why:** Documents which port the app uses  
**Note:** Doesn't actually publish the port (done with `-p` flag)

```dockerfile
# Step 8: Start Command
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```
**Why:** Default command when container starts  
**`--host 0.0.0.0`:** Allows external connections to container

---

## Docker Commands - Step by Step

### 1. Build Docker Image

```bash
# Navigate to project directory
cd d:\Backend\BackendSelf\DockerBasic

# Build image with a tag name
docker build -t my-vite-app .

# Explanation:
# docker build     - Build an image
# -t my-vite-app  - Tag (name) for the image
# .               - Build context (current directory)
```

**What happens:**
1. Docker reads Dockerfile
2. Downloads base image (node:20-alpine)
3. Creates layers for each instruction
4. Caches layers for faster rebuilds

### 2. View Docker Images

```bash
# List all images
docker images

# Output shows:
# REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
# my-vite-app   latest    abc123def456   2 minutes ago   350MB
```

### 3. Run Docker Container

```bash
# Run container with port mapping
docker run -d -p 8080:4173 --name my-app my-vite-app

# Explanation:
# docker run           - Create and start container
# -d                   - Detached mode (runs in background)
# -p 8080:4173        - Port mapping (host:container)
# --name my-app       - Name for the container
# my-vite-app         - Image to use
```

**Port Mapping:**
- `8080` = Port on your machine
- `4173` = Port inside container
- Access at: `http://localhost:8080`

### 4. View Running Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Output shows:
# CONTAINER ID   IMAGE         COMMAND                  STATUS        PORTS
# abc123def456   my-vite-app   "npm run preview..."     Up 5 mins     0.0.0.0:8080->4173/tcp
```

### 5. View Container Logs

```bash
# View logs
docker logs my-app

# Follow logs (real-time)
docker logs -f my-app

# View last 100 lines
docker logs --tail 100 my-app
```

### 6. Execute Commands Inside Container

```bash
# Open bash shell in container
docker exec -it my-app sh

# Run a command in container
docker exec my-app ls -la /app

# Explanation:
# docker exec  - Execute command in running container
# -it          - Interactive terminal
# my-app       - Container name
# sh           - Command to run (Alpine uses sh, not bash)
```

### 7. Stop and Start Containers

```bash
# Stop container
docker stop my-app

# Start stopped container
docker start my-app

# Restart container
docker restart my-app
```

### 8. Remove Containers and Images

```bash
# Stop and remove container
docker stop my-app
docker rm my-app

# Remove image
docker rmi my-vite-app

# Force remove running container
docker rm -f my-app

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a
```

---

## Docker Compose (Multiple Services)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "8080:4173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Add more services (database, backend, etc.)
  # backend:
  #   image: node:20-alpine
  #   working_dir: /app
  #   volumes:
  #     - ./backend:/app
  #   ports:
  #     - "3000:3000"
  #   command: npm start
```

### Docker Compose Commands:

```bash
# Build and start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Stop and remove everything (including volumes)
docker-compose down -v
```

---

## .dockerignore File

Create `.dockerignore` to exclude files from Docker build:

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
build
*.md
.vscode
.idea
```

**Why:** Reduces image size and build time by excluding unnecessary files.

---

## Common Docker Patterns

### Development Mode with Hot Reload

```dockerfile
# Dockerfile.dev
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

Run with volume mounting:
```bash
docker run -d -p 5173:5173 -v ${PWD}:/app -v /app/node_modules my-vite-app
```

### Multi-Stage Build (Smaller Images)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefit:** Final image only contains production files (~20MB vs 350MB)

---

## Troubleshooting

### Issue: Port already in use
```bash
# Find process using port
netstat -ano | findstr :8080

# Kill process (Windows)
taskkill /PID <process_id> /F

# Use different port
docker run -p 8081:4173 my-vite-app
```

### Issue: Container exits immediately
```bash
# Check logs
docker logs my-app

# Run interactively to debug
docker run -it my-vite-app sh
```

### Issue: Changes not reflecting
```bash
# Rebuild without cache
docker build --no-cache -t my-vite-app .

# Remove old containers and images
docker system prune -a
```

### Issue: Permission denied
```bash
# Windows: Run Docker Desktop as Administrator
# Linux: Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## Best Practices

1. **Use .dockerignore**
   - Exclude node_modules, .git, logs

2. **Layer Caching**
   - Copy package.json before source code
   - Most stable files first

3. **Use Alpine Images**
   - Smaller size, faster builds
   - `node:20-alpine` vs `node:20`

4. **Multi-stage Builds**
   - Separate build and runtime stages
   - Smaller production images

5. **Don't Run as Root**
   ```dockerfile
   RUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser
   USER appuser
   ```

6. **Use Environment Variables**
   ```dockerfile
   ENV NODE_ENV=production
   ENV PORT=4173
   ```

7. **Health Checks**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s \
     CMD wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1
   ```

---

## Complete Workflow Example

```bash
# 1. Create project structure
mkdir my-docker-app
cd my-docker-app

# 2. Create Dockerfile
# (Copy from above)

# 3. Create .dockerignore
echo "node_modules" > .dockerignore
echo ".git" >> .dockerignore

# 4. Build image
docker build -t my-vite-app:v1.0 .

# 5. Run container
docker run -d -p 8080:4173 --name my-app my-vite-app:v1.0

# 6. Check if running
docker ps

# 7. View logs
docker logs my-app

# 8. Open browser
start http://localhost:8080

# 9. Stop and remove
docker stop my-app
docker rm my-app
```

---

## Docker Hub - Push Your Image

```bash
# 1. Login to Docker Hub
docker login

# 2. Tag image with your username
docker tag my-vite-app:v1.0 yourusername/my-vite-app:v1.0

# 3. Push to Docker Hub
docker push yourusername/my-vite-app:v1.0

# 4. Pull from anywhere
docker pull yourusername/my-vite-app:v1.0
docker run -p 8080:4173 yourusername/my-vite-app:v1.0
```

---

## Summary

| Command | Purpose |
|---------|---------|
| `docker build -t name .` | Build image |
| `docker run -p 8080:4173 name` | Run container |
| `docker ps` | List running containers |
| `docker logs name` | View logs |
| `docker exec -it name sh` | Enter container |
| `docker stop name` | Stop container |
| `docker rm name` | Remove container |
| `docker rmi name` | Remove image |
| `docker-compose up -d` | Start all services |

---

## Quick Start Commands

```bash
# Build and run in one go
cd d:\Backend\BackendSelf\DockerBasic
docker build -t my-vite-app .
docker run -d -p 8080:4173 --name my-app my-vite-app

# Open in browser
start http://localhost:8080

# View logs
docker logs -f my-app

# Clean up
docker stop my-app && docker rm my-app
```

---

## Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**🐳 Happy Dockerizing!**
