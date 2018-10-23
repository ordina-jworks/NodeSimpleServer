FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY docker_package.json /usr/src/app/package.json
COPY server.js /usr/src/app
RUN npm install

# Bundle app source
COPY dist/ /usr/src/app/www
EXPOSE 8080

CMD [ "npm", "start" ]
