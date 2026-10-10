package com.example.order_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ProductClient {

    private final RestClient restClient;

    public ProductClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }

    public boolean productExists(Long productId) {

        try {
            restClient.get()
                    .uri("/products/{id}", productId)
                    .retrieve()
                    .toBodilessEntity();

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProductAvailable(Long productId, int requiredQuantity) {

        try {

            ProductResponse product = restClient.get()
                    .uri("/products/{id}", productId)
                    .retrieve()
                    .body(ProductResponse.class);

            if (product == null) {
                return false;
            }

            return product.quantity() >= requiredQuantity;

        } catch (Exception e) {
            return false;
        }
    }

    private record ProductResponse(
            Long id,
            String name,
            double price,
            int quantity) {
    }
}