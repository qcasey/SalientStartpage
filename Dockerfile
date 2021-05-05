FROM node:10
COPY . .
RUN npm install
RUN node ./fetch-favicons.js

FROM klakegg/hugo:ext-alpine-onbuild AS hugo

FROM nginx
COPY --from=hugo /target /usr/share/nginx/html