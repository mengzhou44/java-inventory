package com.inventory.backend.inventorymanagement.service;

import com.inventory.backend.inventorymanagement.entities.InventoryItem;
import com.inventory.backend.inventorymanagement.infra.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryManagementService {

    private final InventoryItemRepository repository;

    public InventoryManagementService(InventoryItemRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public InventoryItem createInventoryItem(String productSku, int initialQuantity) {
        if (repository.existsByProductSku(productSku)) {
            throw new IllegalArgumentException("Inventory item already exists for productSku=" + productSku);
        }
        if (initialQuantity < 0) {
            throw new IllegalArgumentException("Initial quantity cannot be negative");
        }
        InventoryItem item = new InventoryItem();
        item.setProductSku(productSku);
        item.setQuantity(initialQuantity);
        return repository.save(item);
    }

    @Transactional(readOnly = true)
    public List<InventoryItem> listAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<InventoryItem> getInventoryItem(String productSku) {
        return repository.findByProductSku(productSku);
    }

    @Transactional
    public InventoryItem adjustInventory(String productSku, int delta, String reason) {
        // Reason is currently informational; could be persisted to an audit table later.
        Optional<InventoryItem> existing = repository.findByProductSku(productSku);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Inventory item not found for productSku=" + productSku);
        }
        InventoryItem current = existing.get();
        int newQuantity = current.getQuantity() + delta;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Adjustment would result in negative quantity");
        }
        current.setQuantity(newQuantity);
        return repository.save(current);
    }

    @Transactional
    public void deleteInventoryItem(String productSku) {
        repository.deleteByProductSku(productSku);
    }
}
