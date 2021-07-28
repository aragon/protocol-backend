FROM node:12.14.0-alpine

# create folder structure
RUN mkdir -p /app/packages/app && mkdir -p /app/packages/server && mkdir -p /app/packages/services && mkdir -p /app/packages/shared

WORKDIR /app

# copy build files
COPY . .

# Create non-root user and use it as the default user
RUN addgroup -S app && adduser -S app -G app -s /sbin/nologin && chown -R app:app /app
USER app

RUN yarn install
RUN yarn lerna link


CMD [ "yarn", "start:server"]
