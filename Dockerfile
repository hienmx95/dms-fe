FROM registry-dev.truesight.asia/truesight/node:stable as node-dev

WORKDIR /src

RUN apt-get update && apt-get install -y net-tools curl iputils-ping telnetd telnet nano vim dnsutils

COPY package.json .npmrc ./

RUN  yarn install --development

COPY . .

RUN yarn build

# Using nginx to serve front-end
FROM registry-dev.truesight.asia/truesight/nginx:stable

EXPOSE 80

WORKDIR /var/www/html

USER root
RUN chmod -R g+w /var/cache/
RUN chmod -R g+w /var/run/

# Copy built artifacts
COPY --from=node-dev /src/build/ ./

# Copy nginx configuration folder
COPY ./nginx/conf.d/dms.conf /etc/nginx/conf.d/default.conf
