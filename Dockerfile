FROM node:18-alpine
WORKDIR /home/ws
COPY . .
RUN npm install
RUN mv .env.example .env
EXPOSE 3001
CMD ["npm", "start"]