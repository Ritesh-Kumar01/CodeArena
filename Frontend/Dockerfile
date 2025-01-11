# Step 1: Use official node image as base image
FROM node:18 as build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application files
COPY . .

# Step 5: Build the Vite project
RUN npm run build

# Step 6: Serve the application using a simple web server
FROM nginx:alpine

# Step 7: Copy the build output to the nginx container
COPY --from=build /app/dist /usr/share/nginx/html

# Step 8: Expose port 80
EXPOSE 80

# Step 9: Start nginx
CMD ["nginx", "-g", "daemon off;"]
