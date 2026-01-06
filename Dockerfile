FROM node:22

EXPOSE 3006

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "start"]
