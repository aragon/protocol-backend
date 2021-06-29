FROM node:12.19.0-alpine
RUN apk add --no-cache git

WORKDIR /app

# copy all package json files
COPY ./package.json                       /app/package.json
COPY ./packages/app/package.json          /app/packages/app/package.json
COPY ./packages/server/package.json       /app/packages/server/package.json
COPY ./packages/services/package.json     /app/packages/services/package.json
COPY ./packages/shared/package.json       /app/packages/shared/package.json

# install dependencies
COPY ./yarn.lock                          /app/yarn.lock
RUN yarn install --frozen-lockfile

# try building the app
COPY . .
RUN yarn build

CMD echo specify one of the package.json scripts in command line
