package com.orderfulfillment.orders.ordermanagement.service;

import com.orderfulfillment.orders.ordermanagement.api.CreateOrderRequest;
import com.orderfulfillment.orders.ordermanagement.entities.Order;
import com.orderfulfillment.orders.ordermanagement.entities.OrderItem;
import com.orderfulfillment.orders.ordermanagement.infra.OrderEventProducer;
import com.orderfulfillment.orders.ordermanagement.infra.OrderRepository;
import com.orderfulfillment.orders.ordermanagement.infra.OrderCreatedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer eventProducer;

    public OrderService(OrderRepository orderRepository, OrderEventProducer eventProducer) {
        this.orderRepository = orderRepository;
        this.eventProducer = eventProducer;
    }

    @Transactional(readOnly = true)
    public List<Order> listAll() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerId(request.customerId());
        order.setStatus("PENDING");

        request.lines().forEach(line -> {
            OrderItem item = new OrderItem();
            item.setProductSku(line.productSku());
            item.setQuantity(line.quantity());
            order.addItem(item);
        });

        Order saved = orderRepository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent(
                saved.getId(),
                saved.getCustomerId(),
                saved.getStatus(),
                saved.getItems().stream()
                        .map(i -> new OrderCreatedEvent.OrderLine(i.getProductSku(), i.getQuantity()))
                        .collect(Collectors.toList()),
                Instant.now()
        );
        eventProducer.publishOrderCreated(event);

        return saved;
    }
}

