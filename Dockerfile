FROM node:latest as node
WORKDIR /app
RUN mkdir client

COPY package.json ./
COPY package-lock.json ./
COPY client/package.json ./client/
COPY client/package-lock.json ./client/
RUN npm i
RUN npm i --prefix client

COPY . ./
RUN npm run build2 --prefix client

CMD ["npm", "start"]
