# Stage 1: The 'builder' stage for building the Next.js application.
# We use a Node.js base image with Alpine Linux for a smaller footprint.
FROM node:18-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Install pnpm globally. This is the package manager specified in the README.
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to leverage Docker's layer caching.
# This ensures that we only reinstall dependencies if these files change.
COPY package.json pnpm-lock.yaml ./

# Install project dependencies.
RUN pnpm install

# Copy the rest of the application source code into the working directory.
COPY . .

# Run the Next.js build command as specified in the README.
# This compiles the application for production.
RUN pnpm build


# Stage 2: The 'runner' stage for serving the production build.
# We use a minimal Node.js base image for the final runtime environment.
FROM node:18-alpine AS runner

# Set the working directory inside the container.
WORKDIR /app

# Set environment variables required by Next.js in a production environment.
# NEXT_TELEMETRY_DISABLED=1 is a good practice to opt out of telemetry.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the production build output from the 'builder' stage.
# We only need the .next directory, public assets, and package files.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port that the Next.js application will run on.
EXPOSE 3000

# The command to run the Next.js production server.
# This should be the last command in the Dockerfile.
CMD ["pnpm", "start"]

