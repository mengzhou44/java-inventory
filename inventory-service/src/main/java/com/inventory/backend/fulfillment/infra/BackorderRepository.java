package com.inventory.backend.fulfillment.infra;

import com.inventory.backend.fulfillment.entities.Backorder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BackorderRepository extends JpaRepository<Backorder, Long> {

    List<Backorder> findByOrderId(Long orderId);

    List<Backorder> findByStatus(String status);

    List<Backorder> findByProductSkuAndStatus(String productSku, String status);
}
