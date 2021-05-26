FROM node:12-buster

LABEL name "rockpeaks.com musicpeaks/nextjs"

ARG commit

ENV commit=$commit

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --ignore-optional

# List the dependencies for pipeline debugging
RUN yarn list --depth=0

# Bundle app source
COPY . /usr/src/app

# Build the next app
RUN yarn build

# Build Storybook
# Storybook is disabled for the while.
RUN mkdir -p /usr/src/app/tmp && yarn storybook:static

# Mark our build so we can confirm
RUN echo "{ \"env\":\"development\", \"commit\":\"${commit}\", \"buildDate\": \"`date`\"}" > ./public/static/commit.json

ENV PORT=3001
EXPOSE 3001

CMD [ "yarn", "start" ]
