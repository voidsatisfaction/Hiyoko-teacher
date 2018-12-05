FROM node:8

RUN apt-get update
RUN apt-get -y install lsof

ADD . /ts/hiyoko-teacher
WORKDIR /ts/hiyoko-teacher

RUN npm i

EXPOSE 3000

CMD ["npm", "run", "dev"]