FROM node:16

copy . .

run npm install yarn \
    && yarn install

cmd ['yarn', 'start']
