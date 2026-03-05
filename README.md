# Order Fulfillment

Microservices: **orders-service**, **inventory-service**, **api-gateway**, plus Postgres and Kafka.

---

## How to run the backend services

### Prerequisites

- **Docker** and **Docker Compose** (v2+) installed.
- No need to install Java or Maven locally; the build runs inside containers.

### Option 1: Run all backend services with Docker Compose (recommended)

From the **project root** (where `docker-compose.yml` lives):

```bash
docker compose up --build -d
```

- **`--build`** — Build (or rebuild) images before starting containers. Without it, Compose only uses existing images.
- **`-d`** — Run in the background (detached). Omit it to see logs in the foreground (e.g. `docker compose up --build`).

Each service **Dockerfile** does **not** run `mvn clean`. It runs:
1. **`dependency:go-offline`** — Downloads Maven dependencies (layer is cached until `pom.xml` changes).
2. **`mvnw -B -DskipTests package`** — Compiles and packages the app into a JAR (no `clean`; the build runs in a fresh image layer).

This will:

1. **Build** the three Java services (api-gateway, orders-service, inventory-service). Maven dependencies are downloaded during the build; they are cached so later builds are faster unless you change `pom.xml`.
2. **Start** in order:
   - **orders-db** (Postgres for orders) — port 5433
   - **inventory-db** (Postgres for inventory) — port 5432
   - **Kafka** — port 9092
   - **orders-service** — port 8081
   - **inventory-service** — port 8082
   - **api-gateway** — port 8080

All backend traffic for the UI should go through the **API Gateway** at **http://localhost:8080**. The gateway routes `/api/orders` to orders-service and `/api/inventory` to inventory-service.

**Useful commands:**

| Command | Description |
|---------|--------------|
| `docker compose up --build` | Build (if needed) and run; **logs stream in terminal** (good for debugging) |
| `docker compose up --build -d` | Same, but run in background |
| `docker compose down` | Stop and remove containers |
| `docker compose ps` | List running containers |
| `docker compose logs -f` | Follow logs from **all** services (easy way to see errors) |
| `docker compose logs -f orders-service inventory-service api-gateway` | Follow only app services (less DB/Kafka noise) |
| `docker compose logs -f inventory-service` | Follow one service (e.g. to debug Flyway/startup) |
| `docker compose logs --tail=200 orders-service` | Last 200 lines of a service (no follow) |

**Backend endpoints (via gateway at http://localhost:8080):**

| Path | Service |
|------|---------|
| `GET/POST /api/orders` | orders-service |
| `GET/POST/DELETE /api/inventory`, `/api/inventory/:sku`, `/api/inventory/adjust` | inventory-service |

**Port reference:**

| Service       | URL / Host:Port   |
|---------------|-------------------|
| API Gateway   | http://localhost:8080 |
| Orders        | http://localhost:8081 |
| Inventory     | http://localhost:8082 |
| Orders DB     | localhost:5433    |
| Inventory DB  | localhost:5432    |
| Kafka         | localhost:9092    |

### Option 2: Run backend services locally (without Docker)

If you prefer to run Java services from your IDE or command line:

1. **Start Postgres and Kafka** (e.g. run only the infrastructure from Compose):
   ```bash
   docker compose up -d orders-db inventory-db kafka
   ```

2. **Configure each service** to use `localhost`:
   - **orders-service**: DB at `localhost:5433`, Kafka at `localhost:9092` (set in env or `application.yml`).
   - **inventory-service**: DB at `localhost:5432` (see `inventory-service/src/main/resources/application.yml`).
   - **api-gateway**: Set `ORDERS_SERVICE_URI=http://localhost:8081` and `INVENTORY_SERVICE_URI=http://localhost:8082` so the gateway can reach the services.

3. **Run the apps** (from each module directory or IDE):
   - orders-service: `./mvnw spring-boot:run` (port 8081)
   - inventory-service: `./mvnw spring-boot:run` (port 8082)
   - api-gateway: `./mvnw spring-boot:run` (port 8080)

The UI (Vite) proxies `/api` to **http://localhost:8080**, so the gateway must be running for the app to work.

### Quick sanity check

With the backend running (Docker or local), try:

```bash
# Via gateway (recommended)
curl http://localhost:8080/api/inventory
curl http://localhost:8080/api/orders
```

---

## UI

From the `ui` directory (with the backend running):

```bash
cd ui && npm install && npm run dev
```

Then open **http://localhost:4000**. The dev server proxies `/api` to the gateway at http://localhost:8080.
