FROM node:14-alpine as app

WORKDIR /usr/src/app

COPY ./package.json ./

COPY . ./
RUN npm install

FROM nginx:alpine
COPY --from=app /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]