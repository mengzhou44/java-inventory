-- Orders: source of truth for customer orders
CREATE TABLE orders (
    id               BIGSERIAL PRIMARY KEY,
    external_order_id VARCHAR(64),
    customer_id      VARCHAR(255) NOT NULL,
    status           VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_status ON orders (status);

-- Order items
CREATE TABLE order_item (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_sku     VARCHAR(255) NOT NULL,
    quantity        INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_item_order ON order_item (order_id);
CREATE INDEX idx_order_item_sku ON order_item (product_sku);

