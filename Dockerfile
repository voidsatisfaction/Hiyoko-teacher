FROM node:8

ADD . /ts/hiyoko-teacher
WORKDIR /ts/hiyoko-teacher

RUN npm i
RUN npm i -g serverless

EXPOSE 3000

CMD ["npm", "run", "dev"]