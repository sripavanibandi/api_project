package com.example.order_service.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.order_service.model.Order;
import com.example.order_service.model.OrderItem;
import com.example.order_service.service.OrderService;
import com.example.order_service.transaction.TransactionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final TransactionService transactionService;

    public OrderController(
            OrderService orderService,
            TransactionService transactionService) {

        this.orderService = orderService;
        this.transactionService = transactionService;
    }

    // Place Order
    @PostMapping
    public Order placeOrder(
            @Valid @RequestBody Order order,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        String userName =
                (String) request.getAttribute("userName");

        // Always use the authenticated user's details
        order.setCustomerEmail(userEmail);
        order.setCustomerName(userName);

        return orderService.placeOrder(order);
    }

    // View only logged-in user's orders
    @GetMapping
    public List<Order> getAllOrders(
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.getAllOrders(userEmail);
    }

    // View one order
    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.getOrderById(
                id,
                userEmail
        );
    }

    // Update order status
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.updateOrderStatus(
                id,
                status,
                userEmail
        );
    }

    // Cancel Order
    @DeleteMapping("/{id}")
    public Order cancelOrder(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.cancelOrder(
                id,
                userEmail
        );
    }

    // Add Order Item
    @PostMapping("/items")
    public OrderItem addOrderItem(
            @Valid @RequestBody OrderItem orderItem,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.addOrderItem(
                orderItem,
                userEmail
        );
    }

    // View Order Items
    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(
            @PathVariable Long orderId,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.getOrderItems(
                orderId,
                userEmail
        );
    }

    // Calculate Item Price
    @GetMapping("/items/price")
    public double calculateItemPrice(
            @RequestParam double price,
            @RequestParam int quantity) {

        OrderItem orderItem =
                new OrderItem();

        orderItem.setPrice(price);
        orderItem.setQuantity(quantity);

        return orderService.calculateItemPrice(
                orderItem
        );
    }

    // Update Order Item Quantity
    @PutMapping("/items/{itemId}/quantity")
    public OrderItem updateQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.updateQuantity(
                itemId,
                quantity,
                userEmail
        );
    }

    // Calculate Order Total
    @GetMapping("/{orderId}/total")
    public double calculateOrderTotal(
            @PathVariable Long orderId,
            HttpServletRequest request) {

        String userEmail =
                (String) request.getAttribute("userEmail");

        return orderService.calculateOrderTotal(
                orderId,
                userEmail
        );
    }

    // Process complete order transaction
    @PostMapping("/process")
    public Order processOrder(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {

        Order order = new Order();

        String userEmail =
                (String) httpRequest.getAttribute("userEmail");

        String userName =
                (String) httpRequest.getAttribute("userName");

        // Always use authenticated user
        order.setCustomerName(userName);
        order.setCustomerEmail(userEmail);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemData =
                (List<Map<String, Object>>) request.get("items");

        List<OrderItem> items =
                new ArrayList<>();

        for (Map<String, Object> data : itemData) {

            OrderItem item =
                    new OrderItem();

            item.setProductId(
                    ((Number) data.get("productId"))
                            .longValue()
            );

            item.setProductName(
                    (String) data.get("productName")
            );

            item.setQuantity(
                    ((Number) data.get("quantity"))
                            .intValue()
            );

            item.setPrice(
                    ((Number) data.get("price"))
                            .doubleValue()
            );

            items.add(item);
        }

        return transactionService.processOrder(
                order,
                items
        );
    }
}