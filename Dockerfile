# for development / test
FROM node:14.18-alpine3.14

ENV LANG C.UTF-8
ENV ROOT_PATH /app
ENV NODE_ENV production
RUN mkdir $ROOT_PATH
WORKDIR $ROOT_PATH

RUN apk update && \
    apk add --update --no-cache --virtual=.build-dep \
      build-base \
      linux-headers \
      postgresql-dev \
      tzdata && \
    apk add --update --no-cache \
      postgresql-client \
      file && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del .build-dep && \
    rm -rf /var/cache/apk/*

RUN yarn global add typescript@4.4.4
COPY ./yarn.lock ./package.json /app/
RUN yarn install && yarn cache clean
COPY . /app/
RUN yarn prestart:prod

CMD ["yarn", "start:prod"]
