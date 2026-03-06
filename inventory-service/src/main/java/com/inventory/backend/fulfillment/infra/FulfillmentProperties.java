package com.inventory.backend.fulfillment.infra;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "fulfillment")
public class FulfillmentProperties {

    /** If true, allocate what we can and backorder the rest. If false, ship complete only (all or nothing). */
    private boolean allowPartial = true;

    /** Do not allocate if remaining stock would drop below this (per product). */
    private int minResidualStock = 0;

    public boolean isAllowPartial() {
        return allowPartial;
    }

    public void setAllowPartial(boolean allowPartial) {
        this.allowPartial = allowPartial;
    }

    public int getMinResidualStock() {
        return minResidualStock;
    }

    public void setMinResidualStock(int minResidualStock) {
        this.minResidualStock = minResidualStock;
    }
}
