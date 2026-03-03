-- Order: customer orders
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     VARCHAR(255) NOT NULL,
    order_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_status ON orders (status);

-- OrderItem: line items and fulfillment per order
CREATE TABLE order_item (
    id                  BIGSERIAL PRIMARY KEY,
    order_id            BIGINT NOT NULL,
    product_sku         VARCHAR(255) NOT NULL,
    quantity_ordered    INT NOT NULL,
    quantity_fulfilled  INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE INDEX idx_order_item_order ON order_item (order_id);
CREATE INDEX idx_order_item_product ON order_item (product_sku);

