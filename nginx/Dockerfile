FROM alpine:3.18.3

EXPOSE 443

# Update the package 
RUN apk update

# install Nginx and openrc
RUN apk add nginx openrc openssl

RUN mkdir -p /run/openrc && \
      touch /run/openrc/softlevel && \
      rc-update add nginx default


COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./tools/script.sh .
RUN chmod +x script.sh

CMD ["sh", "script.sh"]
# Start Nginx