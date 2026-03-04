-- Simplify model to single-location inventory per product

-- 1) inventory_item: drop location_code and its unique constraint/index,
--    and enforce uniqueness per product only.
ALTER TABLE inventory_item
    DROP CONSTRAINT uq_inventory_item_product_location,
    DROP COLUMN location_code;

DROP INDEX IF EXISTS idx_inventory_item_location;

ALTER TABLE inventory_item
    ADD CONSTRAINT uq_inventory_item_product UNIQUE (product_sku);

-- 2) replenishment_order: drop location_code and its index
ALTER TABLE replenishment_order
    DROP COLUMN location_code;

DROP INDEX IF EXISTS idx_replenishment_order_location;

