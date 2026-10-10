package com.example.order_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.order_service.client.ProductClient;
import com.example.order_service.exception.OrderItemNotFoundException;
import com.example.order_service.exception.OrderNotFoundException;
import com.example.order_service.model.Order;
import com.example.order_service.model.OrderItem;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductClient productClient;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductClient productClient) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productClient = productClient;
    }

    // Place Order
    @Transactional
    public Order placeOrder(Order order) {

        order.setStatus("CONFIRMED");

        return orderRepository.save(order);
    }

    // View only logged-in user's orders
    public List<Order> getAllOrders(String customerEmail) {

        return orderRepository
                .findByCustomerEmailIgnoreCase(customerEmail);
    }

    // View order by ID - only if it belongs to logged-in user
    public Order getOrderById(Long id, String customerEmail) {

        return getOwnedOrder(id, customerEmail);
    }

    // Update order status
    public Order updateOrderStatus(
            Long id,
            String status,
            String customerEmail) {

        Order order = getOwnedOrder(id, customerEmail);

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // Cancel Order
    public Order cancelOrder(
            Long id,
            String customerEmail) {

        Order order = getOwnedOrder(id, customerEmail);

        order.setStatus("CANCELLED");

        return orderRepository.save(order);
    }

    // Add Order Item
    @Transactional
    public OrderItem addOrderItem(
            OrderItem orderItem,
            String customerEmail) {

        // Check whether order exists
        Order order = getOwnedOrder(
                orderItem.getOrderId(),
                customerEmail
        );

        // Check whether product exists
        boolean productExists =
                productClient.productExists(
                        orderItem.getProductId()
                );

        if (!productExists) {
            throw new IllegalArgumentException(
                    "Product not found with ID: "
                            + orderItem.getProductId()
            );
        }

        // Check whether product has enough stock
        boolean productAvailable =
                productClient.isProductAvailable(
                        orderItem.getProductId(),
                        orderItem.getQuantity()
                );

        if (!productAvailable) {
            throw new IllegalArgumentException(
                    "Insufficient product stock for ID: "
                            + orderItem.getProductId()
            );
        }

        // Save order item
        OrderItem savedItem =
                orderItemRepository.save(orderItem);

        // Update order total
        updateOrderTotal(order.getId());

        return savedItem;
    }

    // View Order Items
    public List<OrderItem> getOrderItems(
            Long orderId,
            String customerEmail) {

        // Verify that this order belongs to the logged-in user
        getOwnedOrder(orderId, customerEmail);

        return orderItemRepository.findByOrderId(orderId);
    }

    // Calculate Item Price
    public double calculateItemPrice(OrderItem orderItem) {

        return orderItem.getPrice()
                * orderItem.getQuantity();
    }

    // Update Order Item Quantity
    @Transactional
    public OrderItem updateQuantity(
            Long itemId,
            int quantity,
            String customerEmail) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        OrderItem item =
                orderItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new OrderItemNotFoundException(
                                        "Order item not found with ID: "
                                                + itemId
                                )
                        );

        // Make sure the order item belongs
        // to the logged-in user's order
        getOwnedOrder(
                item.getOrderId(),
                customerEmail
        );

        item.setQuantity(quantity);

        OrderItem updatedItem =
                orderItemRepository.save(item);

        // Recalculate order total
        updateOrderTotal(item.getOrderId());

        return updatedItem;
    }

    // Calculate Order Total
    public double calculateOrderTotal(
            Long orderId,
            String customerEmail) {

        // Verify ownership
        getOwnedOrder(orderId, customerEmail);

        List<OrderItem> items =
                orderItemRepository.findByOrderId(orderId);

        double total = 0;

        for (OrderItem item : items) {

            total += item.getPrice()
                    * item.getQuantity();
        }

        return total;
    }

    // Update total price inside Order table
    private void updateOrderTotal(Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with ID: "
                                                + orderId
                                )
                        );

        double total =
                calculateOrderTotalWithoutOwnership(orderId);

        order.setTotalPrice(total);

        orderRepository.save(order);
    }

    // Calculate total internally
    private double calculateOrderTotalWithoutOwnership(
            Long orderId) {

        List<OrderItem> items =
                orderItemRepository.findByOrderId(orderId);

        double total = 0;

        for (OrderItem item : items) {

            total += item.getPrice()
                    * item.getQuantity();
        }

        return total;
    }

    // Verify order ownership
    private Order getOwnedOrder(
            Long id,
            String customerEmail) {

        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with ID: "
                                                + id
                                )
                        );

        if (!order.getCustomerEmail()
                .equalsIgnoreCase(customerEmail)) {

            throw new OrderNotFoundException(
                    "Order not found with ID: " + id
            );
        }

        return order;
    }
}