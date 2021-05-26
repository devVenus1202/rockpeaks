FROM node:12-alpine

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

# No Storybook for production

# Mark our build so we can confirm
RUN echo "{ \"env\":\"production\", \"commit\":\"${commit}\", \"buildDate\": \"`date`\"}" > ./public/static/commit.json

ENV PORT=3001
EXPOSE 3001

# Start sets NODE_ENV=production
CMD [ "yarn", "start" ]