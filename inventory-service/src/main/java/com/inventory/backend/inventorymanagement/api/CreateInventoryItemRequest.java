package com.inventory.backend.inventorymanagement.api;

public record CreateInventoryItemRequest(String productSku, int initialQuantity) {
}
