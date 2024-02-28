FROM alpine:3.18.3

EXPOSE 443

# Update the package 
RUN apk update

# install Nginx and openrc
RUN apk add nginx openrc openssl

RUN mkdir -p /run/openrc && \
      touch /run/openrc/softlevel && \
      rc-update add nginx default 
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout  /etc/ssl/private-key.pem \
      -out /etc/ssl/hbenfadd.42.fr.csr -subj '/'

COPY ./conf/default.conf /etc/nginx/http.d/default.conf


# Start Nginx
CMD ["nginx", "-g", "daemon off;"]