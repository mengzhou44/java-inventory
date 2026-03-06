package com.inventory.backend.fulfillment.infra;

import com.inventory.backend.fulfillment.entities.OrderAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderAllocationRepository extends JpaRepository<OrderAllocation, Long> {

    List<OrderAllocation> findByOrderId(Long orderId);
}
