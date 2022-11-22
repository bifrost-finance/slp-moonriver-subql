FROM onfinality/subql-node:v1.10.2
WORKDIR /app
COPY . .
RUN  yarn install && yarn codegen && yarn build
Entrypoint  ["/sbin/tini","--","/usr/local/lib/node_modules/@subql/node/bin/run"]
