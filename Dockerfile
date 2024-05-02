FROM node:16-slim

WORKDIR /usr/src/app


COPY package.json .

RUN npm i

COPY . .

ENTRYPOINT ["npm", "run", "start"]
