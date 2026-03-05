package com.orderfulfillment.orders.ordermanagement.infra;

import com.orderfulfillment.orders.ordermanagement.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

