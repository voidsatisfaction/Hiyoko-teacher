FROM node:8

RUN apt-get update
RUN apt-get -y install lsof

ADD . /ts/hiyoko-teacher
WORKDIR /ts/hiyoko-teacher

RUN npm i
RUN npm i -g serverless

EXPOSE 3000

CMD ["npm", "run", "dev"]