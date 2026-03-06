package com.inventory.backend.fulfillment.service;

import com.inventory.backend.fulfillment.entities.Backorder;
import com.inventory.backend.fulfillment.entities.OrderAllocation;
import com.inventory.backend.fulfillment.infra.*;
import com.inventory.backend.inventorymanagement.entities.InventoryItem;
import com.inventory.backend.inventorymanagement.infra.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FulfillmentService {

    private final InventoryItemRepository inventoryRepository;
    private final OrderAllocationRepository allocationRepository;
    private final BackorderRepository backorderRepository;
    private final FulfillmentProperties properties;

    public FulfillmentService(
            InventoryItemRepository inventoryRepository,
            OrderAllocationRepository allocationRepository,
            BackorderRepository backorderRepository,
            FulfillmentProperties properties) {
        this.inventoryRepository = inventoryRepository;
        this.allocationRepository = allocationRepository;
        this.backorderRepository = backorderRepository;
        this.properties = properties;
    }

    /**
     * Process order.created: allocate inventory per line (condition-based) and create backorders for shortfall.
     */
    @Transactional
    public void processOrderCreated(OrderCreatedEventPayload event) {
        if (event.lines() == null || event.lines().isEmpty()) return;

        int minResidual = properties.getMinResidualStock();
        boolean allowPartial = properties.isAllowPartial();

        // Load current inventory per SKU and track running "available" as we plan allocations
        Map<String, Integer> availableBySku = new LinkedHashMap<>();
        for (OrderCreatedEventPayload.OrderLinePayload line : event.lines()) {
            availableBySku.putIfAbsent(line.productSku(),
                    inventoryRepository.findByProductSku(line.productSku())
                            .map(InventoryItem::getQuantity)
                            .orElse(0));
        }

        // First pass: compute how much we can allocate per line (without deducting yet)
        List<LinePlan> plans = new ArrayList<>();
        for (OrderCreatedEventPayload.OrderLinePayload line : event.lines()) {
            int available = availableBySku.get(line.productSku());
            int allocatable = Math.max(0, available - minResidual);
            int toAllocate = Math.min(line.quantity(), allocatable);
            int toBackorder = line.quantity() - toAllocate;
            plans.add(new LinePlan(line.productSku(), line.quantity(), toAllocate, toBackorder, available));
            availableBySku.put(line.productSku(), available - toAllocate);
        }

        // Ship-complete-only: if any line cannot be fully satisfied, allocate nothing and backorder all
        if (!allowPartial) {
            boolean canFulfillAll = plans.stream().allMatch(p -> p.toBackorder == 0);
            if (!canFulfillAll) {
                plans = plans.stream()
                        .map(p -> new LinePlan(p.sku, p.requested, 0, p.requested, p.available))
                        .toList();
            }
        }

        // Persist allocations and backorders, deduct inventory
        for (LinePlan plan : plans) {
            OrderAllocation alloc = new OrderAllocation();
            alloc.setOrderId(event.orderId());
            alloc.setProductSku(plan.sku);
            alloc.setQuantityRequested(plan.requested);
            alloc.setQuantityAllocated(plan.toAllocate);
            alloc.setStatus(plan.toAllocate > 0
                    ? (plan.toBackorder > 0 ? OrderAllocation.STATUS_BACKORDERED : OrderAllocation.STATUS_ALLOCATED)
                    : OrderAllocation.STATUS_BACKORDERED);
            allocationRepository.save(alloc);

            if (plan.toBackorder > 0) {
                Backorder bo = new Backorder();
                bo.setOrderId(event.orderId());
                bo.setProductSku(plan.sku);
                bo.setQuantity(plan.toBackorder);
                bo.setStatus(Backorder.STATUS_PENDING);
                backorderRepository.save(bo);
            }

            if (plan.toAllocate > 0) {
                Optional<InventoryItem> itemOpt = inventoryRepository.findByProductSku(plan.sku);
                if (itemOpt.isPresent()) {
                    InventoryItem item = itemOpt.get();
                    item.setQuantity(item.getQuantity() - plan.toAllocate);
                    inventoryRepository.save(item);
                }
            }
        }
    }

    private record LinePlan(String sku, int requested, int toAllocate, int toBackorder, int available) {}
}
