FROM node:12-buster

LABEL name="rockpeaks.com musicpeaks/nextjs"

RUN npm install -g yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install --ignore-optional

# Bundle app source
COPY . /usr/src/app

EXPOSE 3001
CMD [ "npm", "run", "dev" ]
