FROM node:lts-alpine
RUN apk update
#RUN apk add gcc libc-dev g++ libffi-dev libxml2 unixodbc-dev
RUN apk add unixodbc-dev
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
