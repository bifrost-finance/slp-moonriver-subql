FROM onfinality/subql-node:latest
WORKDIR /app
COPY . .
RUN  yarn install && yarn codegen && yarn build
WORKDIR /
# Entrypoint  ["/sbin/tini","--","/usr/local/lib/node_modules/@subql/node/bin/run"]
