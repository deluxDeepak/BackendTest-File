# File: DockerBasicInfo.md

## Purpose
Short reference of common Docker commands, what they do, why you’d use them, important flags and common pitfalls.

---

## Quick commands (command → one-line why)
- docker run [image]  
    Run a container from an image (start a new container instance).
- docker ps  
    List running containers (quick status view).
- docker ps -a  
    List all containers including stopped ones (see history).
- docker images  
    List local images (what you have on disk).
- docker pull [image]  
    Download an image from a registry (get base images).
- docker build -t name:tag .  
    Build an image from a Dockerfile (create your app image).
- docker exec -it [container] /bin/sh  
    Open a shell in a running container (debug or inspect).
- docker logs -f [container]  
    Follow container logs (live debugging).
- docker stop/start/restart [container]  
    Gracefully stop/start/restart a container (lifecycle control).
- docker rm [container]  
    Remove stopped containers (cleanup).
- docker rmi [image]  
    Remove images (free disk).
- docker system prune -a  
    Remove unused containers, images, networks (reclaim space).
- docker stats  
    Live resource usage for containers (performance troubleshooting).
- docker inspect [container|image]  
    Low-level JSON details (config and runtime settings).
- docker-compose up -d  
    Start services defined in docker-compose.yml in background (multi-container apps).
- docker-compose down  
    Stop and remove compose services (teardown).

---

## Common flags and what they mean
- -d, --detach  
    Run container in background (daemonize).
- -p hostPort:containerPort  
    Publish container port to the host (expose service).
- -it  (short for -i -t)  
    -i keeps STDIN open; -t allocates a pseudo-TTY. Use together for interactive shells.
- --name NAME  
    Assign a custom name to container (easier references).
- --rm  
    Automatically remove container when it exits (no leftover stopped containers).
- -v hostPath:containerPath[:ro|z|Z]  
    Bind mount or volume. Persistent data or mount code during dev.
- --mount type=volume,source=...,target=...  
    Newer, more explicit volume syntax.
- -e KEY=VAL / --env-file  
    Set environment variables inside container.
- --network NAME  
    Connect container to a specific Docker network.
- --privileged  
    Grant extended privileges (avoid in production).
- --restart no|on-failure[:max]|always|unless-stopped  
    Restart policy for reliability.
- --build-arg NAME=VAL  
    Pass build-time variables to Dockerfile.
- --no-cache (docker build)  
    Force rebuild without using cache.

---

## Examples (practical)
- Run web app in background, map port and name it:
    docker run -d -p 8080:80 --name webapp myimage:latest
- Start interactive debug shell:
    docker run --rm -it --name tmp-debug myimage:latest /bin/sh
- Mount code for live dev with port mapping:
    docker run -it -v /path/to/code:/app -p 3000:3000 --name dev myimage
- Build without cache and tag:
    docker build --no-cache -t myapp:1.0 .

---

## Best practices (short)
- Use explicit image tags (avoid latest in production).
- Keep images small (multi-stage builds).
- Do not bind-mount sensitive host paths or the Docker socket unless necessary.
- Use named volumes for persistent data.
- Use restart policies for critical services.
- Avoid --privileged in production.

---

## Common mistakes to avoid
- Forgetting to map ports (-p) and wondering why service is unreachable.
- Using -it for background services instead of -d.
- Leaving many dangling images -> disk full (use docker system prune).
- Running as root inside container unnecessarily (use non-root user).
- Exposing ports publicly without firewall rules.
- Volume path mistakes on Windows (use correct path format).

---

# File: DockerTroubleshooting.md

## Common problems and commands to diagnose/fix

1. Container exits immediately
     - Diagnose: docker logs [container], docker inspect --format '{{.State}}' [container]
     - Fix: Run interactive: docker run --rm -it image /bin/sh to reproduce; check ENTRYPOINT/CMD and process staying alive.

2. "Port already in use"
     - Diagnose: ss -ltnp | grep <port> (host) or docker ps
     - Fix: Stop conflicting service or map to different host port (docker run -p 8081:80).

3. Permission denied (bind mount)
     - Cause: host file permissions or SELinux labels.
     - Fix: Adjust permissions or use :z/:Z for SELinux or run container with correct user (--user).

4. Cannot connect to Docker daemon
     - Diagnose: systemctl status docker (Linux) or check Docker Desktop on Windows/Mac.
     - Fix: Start Docker service, or add user to docker group (new group membership needs logout/login).

5. Image size too big / long build times
     - Fix: Use multi-stage builds, choose slimmer base images (alpine, distroless), clean apt caches, combine RUN steps.

6. Disk space full from images/containers
     - Commands: docker ps -a; docker images; docker system df; cleanup: docker system prune -a --volumes
     - Caution: prune removes unused data — confirm before running.

7. Changes in bind mount not visible/permissions issues on Windows
     - Fix: Use correct path, check line endings, ensure file share is enabled in Docker Desktop.

8. Network problems between containers
     - Diagnose: docker network ls, docker network inspect <network>, ping from exec.
     - Fix: Ensure services on same user-defined bridge network or use docker-compose for predictable networking.

9. Can't pull image / 403/401 from registry
     - Diagnose: docker login, check registry credentials and image name.
     - Fix: docker login <registry> or use correct image path (registry/repo/image:tag).

10. Build caching unexpected behavior
     - Fix: Use --no-cache to force rebuild, or carefully order Dockerfile layers to leverage cache.

---

Keep these files near your project docs. Use docker --help and docker <command> --help for more flags. For compose file details see docker-compose reference.
