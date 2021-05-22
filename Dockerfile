FROM node:12.18-alpine

WORKDIR /code

COPY . .

RUN npm install

CMD ["npm", "start"]