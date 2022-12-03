FROM node:16-bullseye-slim AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

FROM node:16-alpine
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["node", "app.js"]