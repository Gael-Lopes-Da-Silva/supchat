<div align="center">
	<h1>Supchat</h1>
    <a href="https://github.com/Gael-Lopes-Da-Silva/railroad">https://github.com/Gael-Lopes-Da-Silva/supchat</a>
</div>


Description
------------------------------------------------------------------


Usage
------------------------------------------------------------------


Setup
------------------------------------------------------------------

An example of .env file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=supchat
PORT=5000
SECRET=SOMESECRETKEY
```

Build docker file and run:
```
docker build -t supchat:v1 .
docker run -p 8080:80 supchat:v1
```