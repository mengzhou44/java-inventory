-- ReplenishmentOrder: automated replenishments
CREATE TABLE replenishment_order (
    id              BIGSERIAL PRIMARY KEY,
    product_sku     VARCHAR(255) NOT NULL,
    location_code   VARCHAR(255) NOT NULL,
    quantity        INT NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_replenishment_order_product ON replenishment_order (product_sku);
CREATE INDEX idx_replenishment_order_location ON replenishment_order (location_code);
CREATE INDEX idx_replenishment_order_status ON replenishment_order (status);

