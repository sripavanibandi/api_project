package com.example.order_service.transaction;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.order_service.model.Order;
import com.example.order_service.model.OrderItem;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;

@Service
public class TransactionService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public TransactionService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Order processOrder(Order order, List<OrderItem> items) {

        // Step 1: Create the order
        order.setStatus("CONFIRMED");
        Order savedOrder = orderRepository.save(order);

        // Step 2: Save all order items
        for (OrderItem item : items) {
            item.setOrderId(savedOrder.getId());
            orderItemRepository.save(item);
        }

        // Step 3: Calculate total
        double total = 0;

        for (OrderItem item : items) {
            total += item.getPrice() * item.getQuantity();
        }

        savedOrder.setTotalPrice(total);

        // Step 4: Update the order
        savedOrder = orderRepository.save(savedOrder);

        // If an unchecked exception occurs anywhere above,
        // the database transaction will be rolled back.

        return savedOrder;
    }
}