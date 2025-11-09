# Docker Learning Guide

## Core Concept: One Image → Multiple Containers

**Key Principle:** You can create multiple containers from a single Docker image, each running independently.

### Why This Matters:
- **Scalability:** Run multiple instances of your app
- **Load Balancing:** Distribute traffic across containers
- **Testing:** Run same app on different ports simultaneously
- **Zero Downtime:** Deploy new version while old version runs

---

## Creating Multiple Containers from One Image

### Example: Running Same App on Different Ports

```bash
# Container 1 - Port 8080
docker run -d -p 8080:4173 d3c395f85d45

# Container 2 - Port 8081
docker run -d -p 8081:4173 d3c395f85d45

# Container 3 - Port 8082
docker run -d -p 8082:4173 d3c395f85d45
```

**What's Happening:**
- Same image ID: `d3c395f85d45`
- Different host ports: `8080`, `8081`, `8082`
- Same container port: `4173` (Vite preview server)
- Each container is isolated and independent

**Access Points:**
- http://localhost:8080
- http://localhost:8081
- http://localhost:8082

---

## Docker Build & Run Workflow

### Step 1: Build the Docker Image

```bash
docker build -t my-app:v1.0 .
```

**Breakdown:**
- `docker build` - Build command
- `-t my-app:v1.0` - Tag (name:version)
- `.` - Build context (current directory with Dockerfile)

**Best Practices:**
```bash
# Use semantic versioning
docker build -t my-vite-app:v1.0 .
docker build -t my-vite-app:v1.1 .
docker build -t my-vite-app:v2.0 .

# Always tag with version + latest
docker build -t my-vite-app:v2.0 .
docker tag my-vite-app:v2.0 my-vite-app:latest
```

### Step 2: Run the Container with Flags

```bash
docker run -d --rm --name "My-WebApp" -p 8081:4173 my-vite-app:v2.0
```

**Output:**
```
84438bfccec789c31ee9917ab087553730feb8711de722e49dba6931aece0630
```
(This is the container ID - unique identifier for this container instance)

**Flag Breakdown:**

| Flag | What It Does | Why Use It |
|------|--------------|------------|
| `-d` | Detached mode (background) | Terminal stays free, container runs in background |
| `--rm` | Auto-remove on stop | Cleanup automatically, no manual `docker rm` needed |
| `--name "My-WebApp"` | Give container a name | Easy to reference (use name instead of ID) |
| `-p 8081:4173` | Port mapping | Map host port 8081 → container port 4173 |
| `my-vite-app:v2.0` | Image name:tag | Specify which image version to use |

---

## Understanding Docker Images vs Containers

### Docker Images: The Blueprint

**Analogy:** Images are like a recipe or a class definition.

```bash
# View available images
docker images
```

**Example Output:**
```
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
my-vite-app   v2.0      d3c395f85d45   10 mins ago    350MB
my-vite-app   v1.0      abc123def456   1 hour ago     340MB
node          latest    82a1d74c5988   8 weeks ago    1.63GB
nginx         alpine    f6d0b4767a6c   2 weeks ago    23.5MB
```

### Docker Containers: The Running Instance

**Analogy:** Containers are like actual dishes made from the recipe, or object instances from a class.

```bash
# View running containers
docker ps
```

---

## Why You Can't Directly Run Some Images

### Problem: Base Images Need a Command

```bash
# ❌ This won't work as expected
docker run node:latest
```

**Why It Fails:**
- `node:latest` is a **base image** (1.63GB)
- It has Node.js installed but **no default application**
- Container starts, finds nothing to run, and exits immediately

**What's Missing:**
- No `CMD` or `ENTRYPOINT` defined
- No application code to execute
- It's meant to be a **base for building your app**, not running directly

### Solution: Provide a Command

```bash
# ✅ Run with a command
docker run -it node:latest node --version

# ✅ Start interactive shell
docker run -it node:latest bash

# ✅ Run a Node.js file
docker run -it -v $(pwd):/app -w /app node:latest node index.js
```

### Better Approach: Build Your Own Image

**Create a Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
```

**Build and run:**
```bash
docker build -t my-node-app .
docker run -d -p 3000:3000 my-node-app
```

**Why This Works:**
- You specify the `CMD` (default command to run)
- Container knows what to execute when started
- Doesn't exit immediately

---

## Complete Example: Build, Run, Scale

### 1. Build Your Application Image

```bash
# Navigate to project directory
cd d:\Backend\BackendSelf\DockerBasic

# Build with version tag
docker build -t my-vite-app:v1.0 .

# Verify image created
docker images | grep my-vite-app
```

### 2. Run First Container

```bash
# Run with full flags
docker run -d \
  --name vite-app-1 \
  --rm \
  -p 8080:4173 \
  -e NODE_ENV=production \
  my-vite-app:v1.0

# Check it's running
docker ps
```

### 3. Scale: Run Multiple Instances

```bash
# Instance 2
docker run -d --name vite-app-2 --rm -p 8081:4173 my-vite-app:v1.0

# Instance 3
docker run -d --name vite-app-3 --rm -p 8082:4173 my-vite-app:v1.0

# Instance 4
docker run -d --name vite-app-4 --rm -p 8083:4173 my-vite-app:v1.0
```

**Now you have 4 containers running from 1 image!**

```bash
# Verify all running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Output:**
```
NAMES         STATUS              PORTS
vite-app-1    Up 2 minutes        0.0.0.0:8080->4173/tcp
vite-app-2    Up 1 minute         0.0.0.0:8081->4173/tcp
vite-app-3    Up 30 seconds       0.0.0.0:8082->4173/tcp
vite-app-4    Up 10 seconds       0.0.0.0:8083->4173/tcp
```

### 4. Test All Instances

```bash
# Access different instances
start http://localhost:8080
start http://localhost:8081
start http://localhost:8082
start http://localhost:8083
```

### 5. Stop All Instances

```bash
# Stop by name (--rm flag auto-removes them)
docker stop vite-app-1 vite-app-2 vite-app-3 vite-app-4

# OR stop all containers at once
docker stop $(docker ps -q)
```

---

## Common Patterns & Use Cases

### Pattern 1: Development vs Production

```bash
# Development (with hot reload)
docker run -d \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name dev-app \
  my-vite-app:dev

# Production (optimized build)
docker run -d \
  -p 8080:4173 \
  --name prod-app \
  my-vite-app:v1.0
```

### Pattern 2: Blue-Green Deployment

```bash
# Blue (current version)
docker run -d --name app-blue -p 8080:4173 my-app:v1.0

# Green (new version)
docker run -d --name app-green -p 8081:4173 my-app:v2.0

# Test green version at :8081
# If good, switch traffic to green, stop blue
docker stop app-blue
```

### Pattern 3: Load Balancing Setup

```bash
# Run multiple instances
for i in {1..5}; do
  docker run -d \
    --name app-instance-$i \
    -p 808$i:4173 \
    my-vite-app:v1.0
done

# Now use nginx or a load balancer to distribute traffic
```

---

## Understanding Container IDs

### What Is a Container ID?

```bash
docker run -d my-vite-app:v2.0
# Output: 84438bfccec789c31ee9917ab087553730feb8711de722e49dba6931aece0630
```

**Container ID:** Unique 64-character hash identifying this specific container instance.

### Using Container IDs

```bash
# Full ID
docker logs 84438bfccec789c31ee9917ab087553730feb8711de722e49dba6931aece0630

# Short ID (first 12 characters)
docker logs 84438bfccec7

# Or use container name (easier!)
docker logs My-WebApp
```

**Best Practice:** Always use `--name` flag so you can reference containers by name instead of ID.

---

## Troubleshooting Common Issues

### Issue 1: Port Already in Use

**Error:**
```
Error response from daemon: driver failed programming external connectivity on endpoint:
Bind for 0.0.0.0:8080 failed: port is already allocated
```

**Solution:**
```bash
# Check what's using the port
netstat -ano | findstr :8080

# Use a different host port
docker run -d -p 8090:4173 my-app
```

### Issue 2: Container Exits Immediately

**Check logs:**
```bash
docker logs <container-name>

# Check exit code
docker inspect --format='{{.State.ExitCode}}' <container-name>
```

**Common causes:**
- No `CMD` or `ENTRYPOINT` in Dockerfile
- Application crashed on startup
- Missing environment variables

### Issue 3: Can't Access Application

**Checklist:**
1. Is container running? `docker ps`
2. Is port mapping correct? `docker port <container-name>`
3. Is app listening on `0.0.0.0`? Check logs
4. Is firewall blocking the port?

**Debug:**
```bash
# Check container logs
docker logs -f my-app

# Check if app is listening inside container
docker exec my-app netstat -tulpn

# Access container shell
docker exec -it my-app sh
```

---

## Key Takeaways

1. **One Image = Many Containers**
   - Build once, run multiple isolated instances
   - Each container has its own port mapping

2. **Always Use Tags**
   - `my-app:v1.0` better than `my-app:latest`
   - Enables version control and rollbacks

3. **Name Your Containers**
   - `--name my-app` makes management easier
   - Use descriptive names

4. **Use --rm for Testing**
   - Auto-cleanup saves disk space
   - Perfect for temporary containers

5. **Base Images Need Commands**
   - Images like `node:latest` need a command to run
   - Build your own image with `CMD` for production

---

## Quick Reference

```bash
# Build image
docker build -t my-app:v1.0 .

# Run container (basic)
docker run -d -p 8080:4173 my-app:v1.0

# Run container (full flags)
docker run -d --rm --name my-app -p 8080:4173 -e ENV=prod my-app:v1.0

# List running containers
docker ps

# View logs
docker logs -f my-app

# Stop container
docker stop my-app

# Remove container
docker rm my-app

# Multiple containers from one image
docker run -d -p 8080:4173 --name app-1 my-app:v1.0
docker run -d -p 8081:4173 --name app-2 my-app:v1.0
docker run -d -p 8082:4173 --name app-3 my-app:v1.0
```

---

## Next Steps

- Read `DOCKER_GUIDE.md` for comprehensive Docker documentation
- Check `DOCKER_COMMANDS.md` for all available commands and flags
- Review `Dockerfile` to understand image build process
- Try `docker-compose.yml` for multi-container applications

---

**🐳 Happy Dockerizing!**

