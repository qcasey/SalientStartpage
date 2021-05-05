FROM klakegg/hugo:ext-alpine-ci AS hugo
ENV HUGO_DESTINATION /target
COPY . /src
WORKDIR /src
RUN npm install
RUN npm run build

FROM nginx
COPY --from=hugo /target /usr/share/nginx/html