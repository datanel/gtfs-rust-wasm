FROM rust:1.46-slim-buster as builder
WORKDIR /usr/src/app

RUN apt-get -yqq update;		\
	apt-get -yqq install curl

# wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -;	\
	apt-get install -yqq nodejs

COPY package.json package-lock.json ./
RUN npm install


COPY . .
RUN npm run build


FROM nginx:alpine AS final

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
