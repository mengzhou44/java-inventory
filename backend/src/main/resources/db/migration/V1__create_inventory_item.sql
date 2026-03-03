-- InventoryItem: stock per product/location
CREATE TABLE inventory_item (
    id              BIGSERIAL PRIMARY KEY,
    product_sku     VARCHAR(255) NOT NULL,
    location_code   VARCHAR(255) NOT NULL,
    quantity        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inventory_item_product_location UNIQUE (product_sku, location_code)
);

CREATE INDEX idx_inventory_item_product ON inventory_item (product_sku);
CREATE INDEX idx_inventory_item_location ON inventory_item (location_code);

