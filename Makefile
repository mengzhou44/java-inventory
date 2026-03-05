# Build images (installs dependencies in container) and start all services.
# First time: downloads Maven deps. Later: uses cache unless pom.xml changes.
up:
	docker compose up --build

# Same, detached (background)
up-d:
	docker compose up --build -d

# Stop and remove containers
down:
	docker compose down

# Build images only (no run) — useful to pre-pull dependencies
build:
	docker compose build

.PHONY: up up-d down build
