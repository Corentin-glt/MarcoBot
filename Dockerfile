
FROM node:latest
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY package.json /usr/src/api
COPY . /usr/src/api
RUN rm -rf node_modules
RUN yarn cache clean
RUN npm install
#RUN yarn global add nodemon
EXPOSE 4000
CMD ["yarn", "start"]
