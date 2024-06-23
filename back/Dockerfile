FROM node:alpine

WORKDIR /usr/app

COPY packeger*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/src/index.js" ]