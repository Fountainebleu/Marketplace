.PHONY: up down build logs ps dev install dev-frontend dev-products dev-orders up-fresh

COMPOSE_FILE     := docker-compose.yml
SVC_PRODUCTS_DB  := products-db
SVC_ORDERS_DB    := orders-db
SVC_PRODUCTS_API := products-api
SVC_ORDERS_API   := orders-api
SVC_FRONTEND     := frontend

FRONTEND_DIR     := frontend
PRODUCTS_DIR     := backend/Marketplace/src/Services/ProductService/ProductService.Presentation
ORDERS_DIR       := backend/Marketplace/src/Services/Orders/Orders.Api

up:
	docker compose -f $(COMPOSE_FILE) up --build -d

down:
	docker compose -f $(COMPOSE_FILE) down

build:
	docker compose -f $(COMPOSE_FILE) build

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

ps:
	docker compose -f $(COMPOSE_FILE) ps

dev:
	docker compose -f $(COMPOSE_FILE) up -d $(SVC_PRODUCTS_DB) $(SVC_ORDERS_DB)

install:
	cd $(FRONTEND_DIR) && npm install

dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

dev-products:
	cd $(PRODUCTS_DIR) && dotnet run

dev-orders:
	cd $(ORDERS_DIR) && dotnet run

up-fresh:
 docker compose -f $(COMPOSE_FILE) down -v
 docker compose -f $(COMPOSE_FILE) up --build -d