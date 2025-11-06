# Docker Commands Complete Reference

## Table of Contents
1. [Basic Commands](#basic-commands)
2. [Common Flags Explained](#common-flags-explained)
3. [Image Commands](#image-commands)
4. [Container Commands](#container-commands)
5. [Network Commands](#network-commands)
6. [Volume Commands](#volume-commands)
7. [Docker Compose Commands](#docker-compose-commands)
8. [Troubleshooting Commands](#troubleshooting-commands)
9. [Common Mistakes & Solutions](#common-mistakes--solutions)

---

## Basic Commands

### 1. Check Docker Version
```bash
docker --version
```
**Why:** Verify Docker is installed and check version  
**Example Output:** `Docker version 24.0.7, build afdd53b`

### 2. Docker Info
```bash
docker info
```
**Why:** Display system-wide information about Docker  
**Shows:** Containers count, images count, storage driver, etc.

### 3. Docker Help
```bash
docker --help
docker <command> --help
```
**Why:** Get help for any Docker command  
**Example:**
```bash
docker run --help    # Show all flags for 'run' command
docker build --help  # Show all flags for 'build' command
```

---

## Common Flags Explained

### Container Runtime Flags

| Flag | Full Name | Purpose | Example |
|------|-----------|---------|---------|
| `-d` | `--detach` | Run container in background | `docker run -d nginx` |
| `-it` | `--interactive --tty` | Interactive terminal | `docker run -it ubuntu bash` |
| `-p` | `--publish` | Port mapping (host:container) | `docker run -p 8080:80 nginx` |
| `-P` | `--publish-all` | Publish all exposed ports | `docker run -P nginx` |
| `--name` | N/A | Name the container | `docker run --name my-app nginx` |
| `-v` | `--volume` | Mount volume (host:container) | `docker run -v /data:/app/data nginx` |
| `-e` | `--env` | Set environment variable | `docker run -e NODE_ENV=production node` |
| `--rm` | N/A | Auto-remove container on exit | `docker run --rm ubuntu echo "hello"` |
| `-w` | `--workdir` | Set working directory | `docker run -w /app node npm start` |
| `--network` | N/A | Connect to network | `docker run --network my-network nginx` |

### Build Flags

| Flag | Purpose | Example |
|------|---------|---------|
| `-t` | Tag the image (name:tag) | `docker build -t myapp:v1.0 .` |
| `-f` | Specify Dockerfile path | `docker build -f Dockerfile.dev .` |
| `--no-cache` | Build without using cache | `docker build --no-cache -t myapp .` |
| `--build-arg` | Pass build-time variables | `docker build --build-arg VERSION=1.0 .` |
| `--target` | Build specific stage | `docker build --target production .` |

---

## Image Commands

### 1. Build Image
```bash
docker build -t my-app:latest .
```
**Why:** Create a Docker image from Dockerfile  
**Flags:**
- `-t my-app:latest` → Tag with name and version
- `.` → Build context (current directory)

**Example with multiple flags:**
```bash
docker build -t myapp:v1.0 -f Dockerfile.prod --no-cache --build-arg NODE_ENV=production .
```
**Why each flag:**
- `-t myapp:v1.0` → Name the image
- `-f Dockerfile.prod` → Use production Dockerfile
- `--no-cache` → Ignore cache, rebuild everything
- `--build-arg NODE_ENV=production` → Pass variable to Dockerfile

### 2. List Images
```bash
docker images
# OR
docker image ls
```
**Why:** See all downloaded/built images  
**Output:**
```
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
my-app        latest    abc123def456   2 minutes ago   350MB
node          20        def789ghi012   2 days ago      900MB
```

**Show all images (including intermediate):**
```bash
docker images -a
```

### 3. Pull Image
```bash
docker pull nginx
docker pull nginx:alpine
docker pull redis:7.0
```
**Why:** Download image from Docker Hub  
**Format:** `docker pull <image>:<tag>`

**Example:**
```bash
docker pull node:20-alpine    # Pull specific version
docker pull ubuntu:latest     # Pull latest Ubuntu
```

### 4. Remove Image
```bash
docker rmi my-app
docker rmi abc123def456    # Using image ID
```
**Why:** Delete unused images to save space

**Force remove:**
```bash
docker rmi -f my-app
```

**Remove all unused images:**
```bash
docker image prune -a
```
**Why:** Clean up disk space by removing dangling images

### 5. Tag Image
```bash
docker tag my-app:latest my-app:v1.0
docker tag my-app username/my-app:latest
```
**Why:** Create new tag for existing image (for versioning or pushing to registry)

### 6. Push Image to Registry
```bash
docker login
docker push username/my-app:latest
```
**Why:** Upload image to Docker Hub or private registry

**Complete example:**
```bash
# Build
docker build -t myapp:v1.0 .

# Tag for Docker Hub
docker tag myapp:v1.0 deepak/myapp:v1.0

# Login
docker login

# Push
docker push deepak/myapp:v1.0
```

### 7. Save/Load Images
```bash
# Save image to tar file
docker save -o myapp.tar my-app:latest

# Load image from tar file
docker load -i myapp.tar
```
**Why:** Share images without using a registry

### 8. Image History
```bash
docker history my-app
```
**Why:** See all layers in the image and their sizes

---

## Container Commands

### 1. Run Container
```bash
docker run nginx
```
**Why:** Create and start a container from an image

**Common patterns:**

#### a) Background (Detached) Mode
```bash
docker run -d nginx
```
**Why:** Run in background, terminal is free

#### b) With Port Mapping
```bash
docker run -d -p 8080:80 nginx
```
**Why:** 
- `-d` → Background
- `-p 8080:80` → Map host port 8080 to container port 80
- Access at: `http://localhost:8080`

#### c) With Name
```bash
docker run -d -p 8080:80 --name my-nginx nginx
```
**Why:** Easier to reference container by name instead of ID

#### d) Interactive Mode
```bash
docker run -it ubuntu bash
```
**Why:**
- `-i` → Keep STDIN open
- `-t` → Allocate pseudo-TTY
- Great for debugging or running shell commands

#### e) Auto-remove After Exit
```bash
docker run --rm ubuntu echo "Hello World"
```
**Why:** `--rm` automatically removes container after it exits

#### f) With Environment Variables
```bash
docker run -d -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=mydb mysql
```
**Why:** `-e` passes configuration to the container

#### g) With Volume Mount
```bash
docker run -d -v /host/data:/container/data nginx
```
**Why:** `-v` mounts host directory into container (data persistence)

**Named volume:**
```bash
docker run -d -v mydata:/app/data nginx
```

#### h) Complete Example
```bash
docker run -d \
  --name my-app \
  -p 8080:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -v $(pwd)/logs:/app/logs \
  --restart unless-stopped \
  --network my-network \
  my-node-app:latest
```
**Explanation:**
- `-d` → Background
- `--name my-app` → Container name
- `-p 8080:3000` → Port mapping
- `-e` → Environment variables
- `-v` → Volume for logs
- `--restart unless-stopped` → Auto-restart policy
- `--network my-network` → Connect to custom network

### 2. List Containers

#### Running Containers
```bash
docker ps
```
**Output:**
```
CONTAINER ID   IMAGE     COMMAND                  PORTS                    NAMES
abc123def456   nginx     "/docker-entrypoint.…"   0.0.0.0:8080->80/tcp     my-nginx
```

#### All Containers (including stopped)
```bash
docker ps -a
```

#### Show Container Sizes
```bash
docker ps -s
```

#### Last Created Container
```bash
docker ps -l
```

#### Custom Format
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 3. Stop Container
```bash
docker stop my-nginx
docker stop abc123def456    # Using ID
```
**Why:** Gracefully stop container (sends SIGTERM)

**Stop multiple containers:**
```bash
docker stop container1 container2 container3
```

**Stop all running containers:**
```bash
docker stop $(docker ps -q)
```
**Explanation:** `$(docker ps -q)` lists all container IDs

### 4. Start Container
```bash
docker start my-nginx
```
**Why:** Start a stopped container

**Start multiple:**
```bash
docker start container1 container2
```

### 5. Restart Container
```bash
docker restart my-nginx
```
**Why:** Stop and start container (useful after config changes)

### 6. Pause/Unpause Container
```bash
docker pause my-nginx
docker unpause my-nginx
```
**Why:** Freeze/unfreeze container processes (useful for debugging)

### 7. Remove Container
```bash
docker rm my-nginx
```
**Why:** Delete stopped container

**Force remove running container:**
```bash
docker rm -f my-nginx
```

**Remove all stopped containers:**
```bash
docker container prune
```

**Remove specific stopped containers:**
```bash
docker rm $(docker ps -aq -f status=exited)
```

### 8. View Container Logs
```bash
docker logs my-nginx
```
**Why:** See container output

**Follow logs (real-time):**
```bash
docker logs -f my-nginx
```

**Show timestamps:**
```bash
docker logs -t my-nginx
```

**Show last N lines:**
```bash
docker logs --tail 100 my-nginx
```

**Show logs since specific time:**
```bash
docker logs --since 2h my-nginx     # Last 2 hours
docker logs --since 2024-01-01 my-nginx
```

**Complete example:**
```bash
docker logs -f --tail 50 --since 10m my-nginx
```
**Why each flag:**
- `-f` → Follow (real-time)
- `--tail 50` → Last 50 lines
- `--since 10m` → From last 10 minutes

### 9. Execute Command in Container
```bash
docker exec my-nginx ls /usr/share/nginx/html
```
**Why:** Run command inside running container

**Interactive shell:**
```bash
docker exec -it my-nginx bash
docker exec -it my-nginx sh     # For Alpine images
```
**Why:** `-it` gives you interactive terminal

**As specific user:**
```bash
docker exec -u root -it my-nginx bash
```

**With working directory:**
```bash
docker exec -w /app my-nginx npm test
```

**Example - Database query:**
```bash
docker exec -it mysql-container mysql -u root -p
```

### 10. Inspect Container
```bash
docker inspect my-nginx
```
**Why:** Get detailed information (JSON format) about container

**Get specific field:**
```bash
docker inspect --format='{{.NetworkSettings.IPAddress}}' my-nginx
docker inspect --format='{{.State.Status}}' my-nginx
```

### 11. View Container Stats
```bash
docker stats
```
**Why:** Real-time resource usage (CPU, memory, network, disk)

**For specific container:**
```bash
docker stats my-nginx
```

**Without streaming:**
```bash
docker stats --no-stream
```

### 12. View Container Processes
```bash
docker top my-nginx
```
**Why:** See running processes inside container

### 13. Copy Files
```bash
# From container to host
docker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf

# From host to container
docker cp ./myfile.txt my-nginx:/app/
```
**Why:** Transfer files between host and container

### 14. Port Mapping Info
```bash
docker port my-nginx
```
**Why:** See port mappings for a container
**Output:** `80/tcp -> 0.0.0.0:8080`

### 15. Export/Import Container
```bash
# Export container to tar
docker export my-nginx > nginx-backup.tar

# Import tar as image
cat nginx-backup.tar | docker import - my-nginx-backup:latest
```
**Why:** Backup container filesystem

### 16. Attach to Container
```bash
docker attach my-nginx
```
**Why:** Attach terminal to running container's main process
**Detach:** Press `Ctrl+P`, then `Ctrl+Q`

### 17. Wait for Container
```bash
docker wait my-nginx
```
**Why:** Block until container stops, then print exit code

### 18. Container Diff
```bash
docker diff my-nginx
```
**Why:** Show changes to container's filesystem
**Output:**
- `A` = Added file
- `C` = Changed file
- `D` = Deleted file

---

## Network Commands

### 1. List Networks
```bash
docker network ls
```
**Why:** See all Docker networks
**Default networks:** bridge, host, none

### 2. Create Network
```bash
docker network create my-network
```
**Why:** Create isolated network for containers

**With driver:**
```bash
docker network create --driver bridge my-bridge-network
```

**With subnet:**
```bash
docker network create --subnet=172.18.0.0/16 my-custom-network
```

### 3. Connect Container to Network
```bash
docker network connect my-network my-nginx
```
**Why:** Add running container to a network

### 4. Disconnect Container
```bash
docker network disconnect my-network my-nginx
```

### 5. Inspect Network
```bash
docker network inspect my-network
```
**Why:** See network details and connected containers

### 6. Remove Network
```bash
docker network rm my-network
```

**Remove all unused networks:**
```bash
docker network prune
```

### 7. Run Container with Network
```bash
docker run -d --network my-network --name app1 nginx
docker run -d --network my-network --name app2 nginx
```
**Why:** Containers on same network can communicate by name

**Example - App and Database:**
```bash
# Create network
docker network create myapp-network

# Run database
docker run -d --network myapp-network --name postgres postgres

# Run app (can connect to postgres by name)
docker run -d --network myapp-network -e DATABASE_URL=postgres://postgres:5432 myapp
```

---

## Volume Commands

### 1. List Volumes
```bash
docker volume ls
```
**Why:** See all volumes (persistent data storage)

### 2. Create Volume
```bash
docker volume create mydata
```
**Why:** Create named volume for data persistence

### 3. Inspect Volume
```bash
docker volume inspect mydata
```
**Why:** See volume details (mount point, driver, etc.)

### 4. Remove Volume
```bash
docker volume rm mydata
```

**Remove all unused volumes:**
```bash
docker volume prune
```
**⚠️ Warning:** This deletes data permanently!

### 5. Use Volume in Container
```bash
# Named volume
docker run -d -v mydata:/app/data nginx

# Anonymous volume
docker run -d -v /app/data nginx

# Bind mount (host directory)
docker run -d -v /host/path:/container/path nginx
docker run -d -v $(pwd):/app nginx   # Current directory
```

**Read-only volume:**
```bash
docker run -d -v mydata:/app/data:ro nginx
```

**Example - Database with Volume:**
```bash
docker volume create postgres-data
docker run -d \
  --name postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres
```
**Why:** Data persists even if container is removed

---

## Docker Compose Commands

### 1. Start Services
```bash
docker-compose up
```
**Why:** Start all services defined in docker-compose.yml

**Background mode:**
```bash
docker-compose up -d
```

**Build images before starting:**
```bash
docker-compose up --build
```

**Scale services:**
```bash
docker-compose up -d --scale web=3
```

### 2. Stop Services
```bash
docker-compose stop
```
**Why:** Stop services but keep containers

### 3. Down (Stop and Remove)
```bash
docker-compose down
```
**Why:** Stop and remove containers, networks

**Remove volumes too:**
```bash
docker-compose down -v
```
**⚠️ Warning:** Deletes data!

### 4. View Logs
```bash
docker-compose logs
docker-compose logs -f          # Follow
docker-compose logs web         # Specific service
docker-compose logs --tail 100  # Last 100 lines
```

### 5. List Services
```bash
docker-compose ps
```

### 6. Execute Command
```bash
docker-compose exec web bash
docker-compose exec db psql -U postgres
```

### 7. Build Images
```bash
docker-compose build
docker-compose build --no-cache
```

### 8. Pull Images
```bash
docker-compose pull
```

### 9. Restart Services
```bash
docker-compose restart
docker-compose restart web
```

### 10. Pause/Unpause
```bash
docker-compose pause
docker-compose unpause
```

---

## Troubleshooting Commands

### 1. System Information
```bash
docker system info
docker system df        # Disk usage
```

### 2. Clean Up Everything
```bash
docker system prune
```
**Removes:**
- Stopped containers
- Unused networks
- Dangling images
- Build cache

**Remove everything (including volumes):**
```bash
docker system prune -a --volumes
```
**⚠️ Warning:** Deletes ALL unused data!

### 3. Check Container Health
```bash
docker inspect --format='{{.State.Health.Status}}' my-container
```

### 4. View Events
```bash
docker events
docker events --since 1h
docker events --filter container=my-nginx
```
**Why:** Real-time events from Docker daemon

### 5. Check Resource Limits
```bash
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### 6. Debugging Container Startup
```bash
# Run with interactive terminal
docker run -it myapp bash

# Check logs immediately
docker logs -f myapp

# Inspect exit code
docker inspect myapp --format='{{.State.ExitCode}}'
```

---

## Common Mistakes & Solutions

### Mistake 1: Port Already in Use
**Error:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Solution:**
```bash
# Find process using port (Windows)
netstat -ano | findstr :8080

# Kill process
taskkill /PID <process_id> /F

# OR use different port
docker run -p 8081:80 nginx
```

### Mistake 2: Container Exits Immediately
**Error:** Container starts then stops

**Debug:**
```bash
# Check logs
docker logs my-container

# Check exit code
docker inspect --format='{{.State.ExitCode}}' my-container

# Run interactively to debug
docker run -it myapp sh
```

**Common causes:**
- Main process exits (use proper CMD/ENTRYPOINT)
- Error in startup script
- Missing environment variables

### Mistake 3: Cannot Connect to Container
**Problem:** `curl localhost:8080` doesn't work

**Check:**
```bash
# Verify container is running
docker ps

# Check port mapping
docker port my-container

# Check if app is listening on 0.0.0.0 (not 127.0.0.1)
docker logs my-container
```

**Solution:** Use `--host 0.0.0.0` when starting server

### Mistake 4: Changes Not Reflecting
**Problem:** Code changes don't appear in container

**Solution:**
```bash
# Rebuild without cache
docker build --no-cache -t myapp .

# OR remove old containers/images
docker stop myapp
docker rm myapp
docker rmi myapp
docker build -t myapp .
docker run -d myapp
```

### Mistake 5: Permission Denied
**Error:** `Got permission denied while trying to connect to Docker`

**Solution (Linux):**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Solution (Windows):**
- Run Docker Desktop as Administrator
- OR add user to docker-users group

### Mistake 6: Out of Disk Space
**Error:** `no space left on device`

**Solution:**
```bash
# Check disk usage
docker system df

# Clean up
docker system prune -a
docker volume prune
docker builder prune
```

### Mistake 7: Cannot Remove Image
**Error:** `image is being used by running container`

**Solution:**
```bash
# Stop and remove container first
docker stop my-container
docker rm my-container

# Then remove image
docker rmi myimage

# OR force remove
docker rmi -f myimage
```

### Mistake 8: Wrong Context in Dockerfile
**Error:** `COPY failed: no such file or directory`

**Solution:**
- Ensure files are in build context (usually current directory)
- Check `.dockerignore` isn't excluding files
- Use correct path in COPY command

```bash
# Build with correct context
docker build -t myapp .    # Context is current directory
```

### Mistake 9: Image Too Large
**Problem:** Image is 1GB+

**Solutions:**
```dockerfile
# Use Alpine base images
FROM node:20-alpine   # Instead of node:20 (900MB vs 5MB base)

# Multi-stage build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]

# Use .dockerignore
# Add: node_modules, .git, *.md, tests, etc.
```

### Mistake 10: Container Not Updating
**Problem:** Docker Compose doesn't use new image

**Solution:**
```bash
# Force recreate containers
docker-compose up -d --force-recreate

# Rebuild images
docker-compose up -d --build

# OR complete reset
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Best Practices

### 1. Always Name Your Containers
```bash
# ❌ Bad
docker run -d nginx

# ✅ Good
docker run -d --name my-nginx nginx
```

### 2. Use Specific Tags
```bash
# ❌ Bad
docker pull node

# ✅ Good
docker pull node:20-alpine
```

### 3. Clean Up Regularly
```bash
# Weekly cleanup
docker system prune -a
docker volume prune
```

### 4. Use Docker Compose for Multi-Container Apps
```bash
# ❌ Bad - Multiple docker run commands

# ✅ Good - docker-compose.yml
docker-compose up -d
```

### 5. Use Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1
```

### 6. Don't Run as Root
```dockerfile
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser
USER appuser
```

### 7. Use .dockerignore
```
node_modules
.git
*.md
.env
dist
```

### 8. Label Your Images
```dockerfile
LABEL maintainer="you@email.com"
LABEL version="1.0"
LABEL description="My awesome app"
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Build image | `docker build -t name .` |
| Run container | `docker run -d -p 8080:80 --name myapp image` |
| Stop container | `docker stop myapp` |
| Remove container | `docker rm myapp` |
| View logs | `docker logs -f myapp` |
| Execute command | `docker exec -it myapp bash` |
| List containers | `docker ps` |
| List images | `docker images` |
| Clean up | `docker system prune -a` |
| Compose up | `docker-compose up -d` |
| Compose down | `docker-compose down` |

---

## Real-World Examples

### Example 1: Node.js Application
```bash
# Build
docker build -t myapp:v1.0 .

# Run with all options
docker run -d \
  --name myapp \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://db:5432/mydb \
  -v $(pwd)/logs:/app/logs \
  --network myapp-network \
  myapp:v1.0

# View logs
docker logs -f myapp

# Debug
docker exec -it myapp sh
```

### Example 2: Full Stack with Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:5000
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://postgres:5432/mydb
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  pgdata:
```

```bash
# Run everything
docker-compose up -d

# View logs
docker-compose logs -f

# Scale frontend
docker-compose up -d --scale frontend=3

# Stop everything
docker-compose down
```

---

**🐳 Master these commands and you'll be a Docker pro!**
