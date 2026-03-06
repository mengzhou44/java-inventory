package com.inventory.backend.fulfillment.infra;

import com.inventory.backend.fulfillment.service.FulfillmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {

    private static final Logger log = LoggerFactory.getLogger(OrderCreatedListener.class);

    private final FulfillmentService fulfillmentService;

    public OrderCreatedListener(FulfillmentService fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }

    @KafkaListener(
            topics = "order.created",
            containerFactory = "fulfillmentContainerFactory"
    )
    public void onOrderCreated(OrderCreatedEventPayload event) {
        log.info("Received order.created for orderId={}", event.orderId());
        try {
            fulfillmentService.processOrderCreated(event);
        } catch (Exception e) {
            log.error("Fulfillment failed for orderId={}", event.orderId(), e);
            throw e;
        }
    }
}
