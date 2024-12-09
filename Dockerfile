FROM node:20.18-alpine
WORKDIR /app
# Install curl
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3015
CMD ["npm", "run", "start"]