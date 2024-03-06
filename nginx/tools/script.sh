#!bin/sh

echo -n "initializing nginx" 

# tail -f /dev/null

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private-key.pem \
    -out /etc/ssl/rakhsas.csr \
    -subj "/C=MA/ST=CasaBlanca/L=CasaBlanca/O=AinSebaa/OU=Web Development/CN=rakhsas"

# mv /etc/nginx/http.d/default.conf /etc/nginx/http.d/default.conf.bak

# ln -s /etc/nginx/sites-available/default.conf /etc/nginx/http.d/default.conf

exec nginx -g "daemon off;"
