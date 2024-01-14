FROM node:18
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["npm", "run", "start"]
