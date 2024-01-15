FROM node:alpine as BUILD
WORKDIR '/app'
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=BUILD /app/dist/delivva-front-end /usr/share/nginx/html
