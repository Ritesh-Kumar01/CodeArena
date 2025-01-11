# Step 1: Use official node image as base image
# FROM node:@latest
From node:latest

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application files
COPY . .

# Step 5: Expose the backend port
EXPOSE 5000

# Step 6: Run the Express app
CMD ["npm", "start"]
