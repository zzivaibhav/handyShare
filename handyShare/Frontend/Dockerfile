# Step 1: Build the React app
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the React app for production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
# # Step 2: Serve the app with Nginx
# FROM nginx:alpine

# # Copy the build output from the previous stage to the Nginx html directory
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80 to the host
# EXPOSE 80

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]
