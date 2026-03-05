package com.orderfulfillment.orders.ordermanagement.infra;

import java.time.Instant;
import java.util.List;

public record OrderCreatedEvent(
        Long orderId,
        String customerId,
        String status,
        List<OrderLine> lines,
        Instant createdAt
) {
    public record OrderLine(String productSku, int quantity) {
    }
}

