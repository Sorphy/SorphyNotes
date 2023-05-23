FROM node:16

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn compile

EXPOSE 3000 27017

CMD ['yarn', 'start']