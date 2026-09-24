# Step 1: Base image using Node.js LTS on Alpine Linux for a lightweight, secure image
FROM node:20-alpine

# Step 2: Set production environment flag
ENV NODE_ENV=production

# Step 3: Define the application working directory inside the container
WORKDIR /app

# Step 4: Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Step 5: Install only production dependencies cleanly using npm ci
RUN npm ci --omit=dev && npm cache clean --force

# Step 6: Copy the application source code with correct ownership
COPY --chown=node:node . .

# Step 7: Use non-root user provided by the official Node image for security
USER node

# Step 8: Document the runtime network port
EXPOSE 5000

# Step 9: Define the command to start the application
CMD ["npm", "start"]
