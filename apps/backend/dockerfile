FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN 
EXPOSE 3000
EXPOSE 3001
CMD ["npm", "run", "start"]
