# back/docker/Dockerfile

FROM node:18-alpine

ARG GITHUB_USERNAME
ARG GITHUB_REPO
ARG BRANCH=main
ARG BUILD_COMMAND="npm run build"

WORKDIR /app

# Install git and bash (bash needed for some scripts)
RUN apk add --no-cache git bash

# Clone the repo
RUN git clone --branch ${BRANCH} https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git .

# Install dependencies
RUN npm install

# Run build
RUN bash -c "${BUILD_COMMAND}"

# Build output will be in /app/build or as specified by user

# Expose nothing - this Dockerfile is only for building and outputting files

# Specify the output directory for build artifacts as a volume mount point
VOLUME /app/build

# Default command does nothing since we only use the image to extract build files
CMD ["sleep", "infinity"]
