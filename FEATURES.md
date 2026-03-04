# Inventory Service – Features

## 1. Core Inventory Management

- **Inventory items**
  - Track **global stock per `product_sku`** (single-location model).
  - Create, view, and search inventory items by product.
  - Adjust inventory levels with a reason (correction, damage, etc.).
  - Deactivate/delete inventory items that are no longer active.

- **APIs**
  - `POST /api/inventory`           – create a new inventory item
  - `GET /api/inventory/{productSku}`
  - `POST /api/inventory/adjust`    – adjust quantity (delta + reason)
  - `DELETE /api/inventory/{productSku}` – delete/deactivate an inventory item

## 2. Condition-Based Fulfillment (Single-Location)

- **Fulfillment rules**
  - Only fulfill when:
    - Sufficient **global inventory for the product**.
    - Optional conditions: minimum residual stock, cutoff times, order priority, etc.
  - Configurable rule engine in the service layer for:
    - “Ship complete only” vs. “allow partial fulfillment”.
    - Preferred location types (warehouse vs. store).

- **Statuses**
  - Orders: `PENDING`, `PARTIAL`, `FULFILLED`, `CANCELLED`.
  - Order items: `PENDING`, `ALLOCATED`, `FULFILLED`, `BACKORDERED`.

## 3. Backorder Handling

- **Backorder creation**
  - When requested quantity > available quantity:
    - Fulfill what’s possible (if allowed by rules).
    - Create `backorder` rows for the remaining quantity.
    - Mark the order/order items as `PARTIAL` / `BACKORDERED`.

- **Backorder management**
  - APIs / queries to list open backorders by product, customer, age, and status.
  - When new stock arrives:
    - Automatically or manually allocate to oldest/highest-priority backorders.
    - Update `backorder.status` (e.g. `PENDING` → `ALLOCATED` → `FULFILLED`).

- **Events (optional)**
  - Emit events (e.g. `backorder.created`, `backorder.fulfilled`) for downstream systems.

## 4. Automated Replenishment

- **Low-stock detection**
  - Monitor `inventory_item.quantity` per product against thresholds.
  - On low stock, create a `replenishment_order`:
    - `REQUESTED` → `IN_PROGRESS` → `RECEIVED` → `CANCELLED`.

- **Replenishment workflows**
  - APIs / jobs to:
    - List and track replenishment orders.
    - Update status as external systems confirm shipments.
  - On `RECEIVED`:
    - Increase `inventory_item.quantity`.
    - Trigger backorder reallocation for affected products.

## 5. Kafka Integration (Planned)

- **Consumers**
  - `orders.created` – create orders and allocate inventory.
  - `orders.cancelled` – release inventory and update statuses.
  - `inventory.adjusted` – external adjustments.
  - `replenishment.received` – confirm inbound stock.

- **Producers**
  - `inventory.updated` – broadcast inventory changes.
  - `backorder.*` – notify on backorder lifecycle.
  - `replenishment.requested` – notify purchasing/warehouse systems.

## 6. UI-Facing Capabilities

- **Dashboards**
  - Current stock per product.
  - Low-stock / at-risk items.
  - Open backorders and replenishment orders.

- **Detail views**
  - Per-product inventory and fulfillment status.
  - Order-level and item-level fulfillment status (from inventory’s perspective only).
  - Simple audit trail of inventory changes (who/what/when/why).

## 7. Service Boundaries (No Order Management Here)

- **Ownership**
  - A separate **Orders service** owns the full order lifecycle (creation, listing, pricing, payments, shipping, etc.).
  - The **Inventory service does not expose generic `/orders` CRUD APIs** and is not the source of truth for orders.

- **Inventory’s view of orders**
  - This service keeps a **local projection** of orders (via Kafka events like `orders.created`, `orders.cancelled`) only to:
    - Allocate inventory.
    - Track fulfillment and backorders.
  - Any “list orders” or “get order” APIs for general order management live in the Orders service, not here.

