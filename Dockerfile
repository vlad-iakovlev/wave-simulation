FROM node:16

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 3000
CMD [ "npm", "start" ]
