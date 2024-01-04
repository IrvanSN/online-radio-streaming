FROM node:20-alpine

WORKDIR /server

COPY package.json /server
COPY package-lock.json /server

RUN npm ci

COPY . /server

CMD ["node", "app.js"]
