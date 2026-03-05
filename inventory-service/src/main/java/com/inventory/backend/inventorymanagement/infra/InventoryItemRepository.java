package com.inventory.backend.inventorymanagement.infra;

import com.inventory.backend.inventorymanagement.entities.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    boolean existsByProductSku(String productSku);

    Optional<InventoryItem> findByProductSku(String productSku);

    void deleteByProductSku(String productSku);
}
