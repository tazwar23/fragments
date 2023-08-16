# Use node version 18.13.0 with it's digest to install the dependencies
FROM node:18.13.0-bullseye@sha256:d871edd5b68105ebcbfcde3fe8c79d24cbdbb30430d9bd6251c57c56c7bd7646 AS build

#Metadata about this image
LABEL maintainer="Ahmed Tazwar <atazwar@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

####################################################################################
#
FROM node:18.13.0-bullseye-slim@sha256:bc946484118735406562f17c57ddf5fded436e175b6a51f827aa6540ba1e13de AS deploy

WORKDIR /app

#Copying the modules created in the from the build image's /app directory to this image's app directory
COPY --from=build /app /app

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
