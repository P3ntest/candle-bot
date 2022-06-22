FROM node:16-alpine

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN apk update
RUN apk --no-cache add ffmpeg

RUN apk add g++ make py3-pip

RUN npm install

COPY . /usr/src/bot

CMD ["node", "."]

