
all: build up

up:
	sudo docker compose -f docker-compose.yml up -d

build:
	mkdir -p auth/node_modules/
	mkdir -p chat/node_modules/
	mkdir -p game/node_modules/
	mkdir -p profile/node_modules/
	mkdir -p frontend/node_modules/
	sudo docker compose -f docker-compose.yml build

down:
	sudo docker compose -f docker-compose.yml down -v

clean: down remove
	sudo docker compose -f docker-compose.yml down --rmi all

re: down up