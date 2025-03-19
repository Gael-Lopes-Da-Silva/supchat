FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

CMD ["npm", "run", "start"]
