<div align="center">
	<h1>Supchat</h1>
    <a href="https://github.com/Gael-Lopes-Da-Silva/supchat">https://github.com/Gael-Lopes-Da-Silva/supchat</a>
</div>


Description
------------------------------------------------------------------


Usage
------------------------------------------------------------------




~~~
MYSQL_USER=supchat
MYSQL_PASSWORD=supchat
MYSQL_DATABASE=supchat
MYSQL_ROOT_PASSWORD=root
JWT_SECRET=XXX

FACEBOOK_CLIENT_ID=XXX
FACEBOOK_CLIENT_SECRET=XXX
GOOGLE_CLIENT_ID=XXX
GOOGLE_CLIENT_SECRET=XXX

SMTP_HOST=XXX
SMTP_PORT=XXX
SMTP_USER=XXX
SMTP_PASSWORD=XXX
~~~


------------------------------------------------------------------

Commandes pour lancer docker:

docker compose restart

------------------------------------------------------------------

Commandes pour lancer la partie mobile:

cd .\client\mobile\
npm install
npm update
npx expo install react-native
npm run start
