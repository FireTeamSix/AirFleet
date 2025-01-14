# frontend/Dockerfile

FROM node:18-alpine

# Create and set working directory
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the production server
CMD [ "npm", "run", "start" ]
