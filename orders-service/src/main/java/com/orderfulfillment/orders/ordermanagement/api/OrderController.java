package com.orderfulfillment.orders.ordermanagement.api;

import com.orderfulfillment.orders.ordermanagement.entities.Order;
import com.orderfulfillment.orders.ordermanagement.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Order>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody CreateOrderRequest request) {
        Order created = service.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

