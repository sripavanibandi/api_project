package com.example.order_service.controller;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.example.order_service.model.Order;
import com.example.order_service.model.OrderItem;
import com.example.order_service.repository.OrderItemRepository;
import com.example.order_service.repository.OrderRepository;

@RestController
@RequestMapping("/orders")
public class InvoiceController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    public InvoiceController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping(
            value = "/{orderId}/invoice",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> generateInvoice(@PathVariable Long orderId) {

        try {
            // Find the order
            Order order = orderRepository
                    .findById(orderId)
                    .orElseThrow(() ->
                            new RuntimeException("Order not found: " + orderId));

            // Ensure order total is accurate and non-zero if items exist
            double effectiveTotal = order.getTotalPrice();
            if (effectiveTotal <= 0) {
                List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
                double sum = 0;
                for (OrderItem it : items) {
                    sum += it.getPrice() * it.getQuantity();
                }
                if (sum > 0) {
                    effectiveTotal = sum;
                    order.setTotalPrice(effectiveTotal);
                    orderRepository.save(order);
                }
            }

            String invoiceId = "INV-" + order.getId();
            String totalAmountStr = String.valueOf(effectiveTotal);
            String message = "Invoice generated successfully";

            // Attempt SOAP invoice generation
            try {
                String soapRequest =
                        """
                        <?xml version="1.0" encoding="UTF-8"?>
                        <soapenv:Envelope
                            xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:inv="http://example.com/invoice">
                            <soapenv:Header/>
                            <soapenv:Body>
                                <inv:generateInvoiceRequest>
                                    <orderId>%d</orderId>
                                    <totalAmount>%s</totalAmount>
                                </inv:generateInvoiceRequest>
                            </soapenv:Body>
                        </soapenv:Envelope>
                        """.formatted(
                                order.getId(),
                                totalAmountStr
                        );

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:8082/ws"))
                        .header("Content-Type", "text/xml; charset=UTF-8")
                        .timeout(Duration.ofSeconds(5))
                        .POST(HttpRequest.BodyPublishers.ofString(soapRequest))
                        .build();

                HttpResponse<String> response = httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                    factory.setNamespaceAware(true);

                    Document document = factory.newDocumentBuilder().parse(
                            new ByteArrayInputStream(response.body().getBytes(StandardCharsets.UTF_8))
                    );

                    NodeList invoiceIds = document.getElementsByTagNameNS("http://example.com/invoice", "invoiceId");
                    if (invoiceIds.getLength() == 0) {
                        invoiceIds = document.getElementsByTagName("invoiceId");
                    }

                    NodeList totalAmounts = document.getElementsByTagNameNS("http://example.com/invoice", "totalAmount");
                    if (totalAmounts.getLength() == 0) {
                        totalAmounts = document.getElementsByTagName("totalAmount");
                    }

                    if (invoiceIds.getLength() > 0 && invoiceIds.item(0) != null) {
                        invoiceId = invoiceIds.item(0).getTextContent().trim();
                    }

                    if (totalAmounts.getLength() > 0 && totalAmounts.item(0) != null) {
                        totalAmountStr = totalAmounts.item(0).getTextContent().trim();
                    }

                    message = "Invoice generated successfully using SOAP service";
                }
            } catch (Exception soapEx) {
                // If SOAP fails, fallback gracefully to database-backed invoice
                System.err.println("SOAP service fallback for Order #" + orderId + ": " + soapEx.getMessage());
            }

            Map<String, Object> invoice = new HashMap<>();
            invoice.put("invoiceId", invoiceId);
            invoice.put("orderId", order.getId());
            invoice.put("customerName", order.getCustomerName());
            invoice.put("customerEmail", order.getCustomerEmail());
            invoice.put("deliveryAddress", (order.getDeliveryAddress() != null && !order.getDeliveryAddress().isBlank())
                    ? order.getDeliveryAddress()
                    : "Standard Registered Delivery Address");
            invoice.put("deliveryPhone", order.getDeliveryPhone() != null ? order.getDeliveryPhone() : "");
            invoice.put("totalAmount", totalAmountStr);
            invoice.put("message", message);

            return ResponseEntity.ok(invoice);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : "Failed to generate invoice");
            return ResponseEntity.badRequest().body(error);
        }
    }
}