package com.inventory.backend.fulfillment.infra;

import java.time.Instant;
import java.util.List;

/**
 * Payload for order.created Kafka events (same shape as orders-service OrderCreatedEvent).
 */
public record OrderCreatedEventPayload(
        Long orderId,
        String customerId,
        String status,
        List<OrderLinePayload> lines,
        Instant createdAt
) {
    public record OrderLinePayload(String productSku, int quantity) {
    }
}
