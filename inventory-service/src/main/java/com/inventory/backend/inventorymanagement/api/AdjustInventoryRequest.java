package com.inventory.backend.inventorymanagement.api;

public record AdjustInventoryRequest(String productSku, int delta, String reason) {
}
