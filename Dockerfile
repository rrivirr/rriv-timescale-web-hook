FROM node:22-alpine

EXPOSE 3006

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "start"]
