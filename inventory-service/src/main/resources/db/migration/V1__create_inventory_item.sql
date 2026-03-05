-- InventoryItem: stock per product (single location)
CREATE TABLE inventory_item (
    id              BIGSERIAL PRIMARY KEY,
    product_sku     VARCHAR(255) NOT NULL UNIQUE,
    quantity        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_item_product ON inventory_item (product_sku);

