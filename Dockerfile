FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

#RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
