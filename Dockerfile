# Start from a base image
FROM golang:1.20.4-alpine

# Set the current working directory
WORKDIR /app

# Copy everything from the dist directory
COPY ./dist/ /app

# List the contents of /app directory
RUN ls -la /app

# Set the DOCKER_ENV environment variable
ENV DOCKER_ENV=true

# Expose port 8080
EXPOSE 8080

# Run the server binary
CMD ["/app/server"]
