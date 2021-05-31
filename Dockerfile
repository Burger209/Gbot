FROM node:lts-slim

WORKDIR /usr/src/bot
COPY package*.json ./

RUN apt-get update

COPY . .