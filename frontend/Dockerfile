FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install -force

COPY . .

EXPOSE 4200

CMD ["npm", "run", "dev"]
