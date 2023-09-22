FROM node:18-alpine
WORKDIR /home/ws
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]