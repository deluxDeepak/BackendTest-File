# Step 1: Use official Node.js image as base
# Why: Provides a stable Node.js environment for building and running the app
FROM node:20-alpine

# Step 2: Set working directory inside container
# Why: All subsequent commands will run in this directory
WORKDIR /app

# Step 3: Copy package files first
# Why: Docker caches layers - if package.json doesn't change, dependencies won't reinstall
COPY package*.json ./

# Step 4: Install dependencies
# Why: Install all required npm packages before copying source code
RUN npm install

# Step 5: Copy entire project to container
# Why: After dependencies are installed, copy the application code
COPY . .

# Step 6: Build the Vite app for production
# Why: Creates optimized production build in the dist/ folder
RUN npm run build

# Step 7: Expose port 4173 (Vite preview server)
# Why: Allows external access to the application running inside container
EXPOSE 4173

# Step 8: Start the preview server
# Why: Serves the built application on port 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
