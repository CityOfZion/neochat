FROM node:9 as release

COPY . /code

RUN cd /code && yarn && yarn build

FROM nginx:1.14-alpine

COPY --from=release /code/build/ /usr/share/nginx/html




