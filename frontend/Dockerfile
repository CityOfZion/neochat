FROM node:9 as release

COPY . /code

RUN cd /code && yarn && yarn build && yarn global add serve
WORKDIR /code
CMD ["npm", "start"] 


