FROM node:18.14-alpine

WORKDIR /server

COPY package.json /server
COPY package-lock.json /server

RUN npm ci

COPY . /server

CMD ["node", "app.js"]
