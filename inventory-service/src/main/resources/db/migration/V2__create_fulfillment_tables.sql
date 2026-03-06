-- Order allocation: inventory's view of an order line (allocated vs backordered)
CREATE TABLE order_allocation (
    id                  BIGSERIAL PRIMARY KEY,
    order_id            BIGINT NOT NULL,
    product_sku         VARCHAR(255) NOT NULL,
    quantity_requested  INT NOT NULL,
    quantity_allocated  INT NOT NULL DEFAULT 0,
    status              VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_allocation_order_id ON order_allocation (order_id);
CREATE INDEX idx_order_allocation_product_sku ON order_allocation (product_sku);

-- Backorder: shortfall to fulfill when stock arrives
CREATE TABLE backorder (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT NOT NULL,
    product_sku VARCHAR(255) NOT NULL,
    quantity    INT NOT NULL,
    status      VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backorder_order_id ON backorder (order_id);
CREATE INDEX idx_backorder_product_sku ON backorder (product_sku);
CREATE INDEX idx_backorder_status ON backorder (status);
