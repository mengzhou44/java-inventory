package com.inventory.backend.inventorymanagement.api;

import com.inventory.backend.inventorymanagement.entities.InventoryItem;
import com.inventory.backend.inventorymanagement.service.InventoryManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryManagementService service;

    public InventoryController(InventoryManagementService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<InventoryItem> create(@RequestBody CreateInventoryItemRequest request) {
        InventoryItem created = service.createInventoryItem(
                request.productSku(),
                request.initialQuantity()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{productSku}")
    public ResponseEntity<InventoryItem> get(@PathVariable String productSku) {
        return service.getInventoryItem(productSku)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryItem> adjust(@RequestBody AdjustInventoryRequest request) {
        InventoryItem updated = service.adjustInventory(
                request.productSku(),
                request.delta(),
                request.reason()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{productSku}")
    public ResponseEntity<Void> delete(@PathVariable String productSku) {
        service.deleteInventoryItem(productSku);
        return ResponseEntity.noContent().build();
    }
}
