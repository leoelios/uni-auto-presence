FROM node:16

copy . .

run npm install -g yarn \
    && yarn

cmd ['yarn', 'start']
