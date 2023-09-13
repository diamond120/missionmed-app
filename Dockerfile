FROM node:16.19.1-alpine3.17

RUN mkdir -p /app
WORKDIR /app

RUN apk update && apk upgrade

COPY . /app
RUN yarn install

# add --no-default-rc option with yarn install to avoid using .npmrc file for platform and arch settings

CMD ["yarn", "dev"]