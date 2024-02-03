
all: build up

up: build
	docker compose -f docker-compose.yml up -d

build:
	mkdir -p auth/node_modules/
	mkdir -p chat/node_modules/
	mkdir -p game/node_modules/
	mkdir -p profile/node_modules/
	mkdir -p frontend/node_modules/
	docker compose -f docker-compose.yml build

down:
	docker compose -f docker-compose.yml down -v

clean: down remove
	docker compose -f docker-compose.yml down --rmi all

re: down up