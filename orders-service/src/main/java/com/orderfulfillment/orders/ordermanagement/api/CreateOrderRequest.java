package com.orderfulfillment.orders.ordermanagement.api;

import java.util.List;

public record CreateOrderRequest(
        String customerId,
        List<CreateOrderLine> lines
) {
    public record CreateOrderLine(String productSku, int quantity) {
    }
}

