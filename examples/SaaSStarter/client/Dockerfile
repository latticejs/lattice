FROM node:12
LABEL author="Divyansh Srivastav <d.srivastav@celestialsys.com>"

ARG ENV=dev

RUN mkdir /app
COPY . /app/

WORKDIR /app
RUN npm install
RUN npm run build:${ENV}
CMD npm run serve