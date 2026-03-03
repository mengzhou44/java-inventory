-- Backorder: items that couldn't be fulfilled immediately
CREATE TABLE backorder (
    id                   BIGSERIAL PRIMARY KEY,
    order_item_id        BIGINT NOT NULL,
    product_sku          VARCHAR(255) NOT NULL,
    quantity_backordered INT NOT NULL,
    status               VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_backorder_order_item FOREIGN KEY (order_item_id) REFERENCES order_item (id) ON DELETE CASCADE
);

CREATE INDEX idx_backorder_order_item ON backorder (order_item_id);
CREATE INDEX idx_backorder_product ON backorder (product_sku);
CREATE INDEX idx_backorder_status ON backorder (status);

