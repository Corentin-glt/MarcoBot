
FROM node:10.13.0
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY package.json /usr/src/api
COPY . /usr/src/api
RUN rm -rf node_modules
RUN npm install
#RUN yarn global add nodemon
EXPOSE 4005
CMD ["yarn", "start"]
