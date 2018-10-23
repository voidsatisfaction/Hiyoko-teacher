FROM node:8

ADD . /ts/hiyoko-teacher
WORKDIR /ts/hiyoko-teacher

RUN npm i
RUN npm i -g serverless

CMD ["node", "./script/docker/loop.js"]