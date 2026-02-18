# Production Dockerfile for Strapi v5
FROM node:20-alpine

# Set build arguments and environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install --omit=dev

WORKDIR /opt/app
COPY . .

# Build the Strapi admin panel
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
