-- DATABASE
CREATE DATABASE supchat;
CREATE USER 'supchat'@'%' IDENTIFIED BY 'supchat';
GRANT ALL PRIVILEGES ON supchat.* TO 'supchat'@'%';
FLUSH PRIVILEGES;
USE supchat;