package com.example.order_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name cannot be empty")
    private String customerName;

    @NotBlank(message = "Customer email cannot be empty")
    @Email(message = "Invalid email format")
    private String customerEmail;

    private String status;

    @PositiveOrZero(message = "Total price cannot be negative")
    private double totalPrice;

    @jakarta.persistence.Column(length = 500)
    private String deliveryAddress;

    @jakarta.persistence.Column(length = 50)
    private String deliveryPhone;

    public Order() {
    }

    public Order(String customerName, String customerEmail, String status, double totalPrice) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.status = status;
        this.totalPrice = totalPrice;
    }

    public Order(String customerName, String customerEmail, String status, double totalPrice, String deliveryAddress, String deliveryPhone) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.status = status;
        this.totalPrice = totalPrice;
        this.deliveryAddress = deliveryAddress;
        this.deliveryPhone = deliveryPhone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryPhone() {
        return deliveryPhone;
    }

    public void setDeliveryPhone(String deliveryPhone) {
        this.deliveryPhone = deliveryPhone;
    }
}