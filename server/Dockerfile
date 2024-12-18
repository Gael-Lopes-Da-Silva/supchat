FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
RUN apk --no-cache add mariadb-client \
    && mysql -e "CREATE DATABASE supchat;" \
    && mysql -e "CREATE USER 'supchat'@'%' IDENTIFIED BY 'supchat';" \
    && mysql -e "GRANT ALL PRIVILEGES ON supchat.* TO 'supchat'@'%';" \
    && mysql -e "FLUSH PRIVILEGES;"
COPY ./database/sql/base.sql /docker-entrypoint-initdb.d/
CMD ["node", "index.js"]