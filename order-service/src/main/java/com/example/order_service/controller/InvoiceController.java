package com.example.order_service.controller;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
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
import com.example.order_service.repository.OrderRepository;

@RestController
@RequestMapping("/orders")
public class InvoiceController {

    private final OrderRepository orderRepository;

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    public InvoiceController(
            OrderRepository orderRepository) {

        this.orderRepository = orderRepository;
    }

    @GetMapping(
            value = "/{orderId}/invoice",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> generateInvoice(
            @PathVariable Long orderId) {

        try {

            // Find the order
            Order order = orderRepository
                    .findById(orderId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Order not found: "
                                            + orderId));

            // Create SOAP request
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
                            order.getTotalPrice()
                    );

            // Send SOAP request to the existing SOAP endpoint
            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            "http://localhost:8082/ws"
                                    )
                            )
                            .header(
                                    "Content-Type",
                                    "text/xml; charset=UTF-8"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(
                                                    soapRequest
                                            )
                            )
                            .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers
                                    .ofString()
                    );

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                throw new RuntimeException(
                        "SOAP service returned HTTP "
                                + response.statusCode()
                );
            }

            // Parse SOAP response
            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();

            factory.setNamespaceAware(true);

            Document document =
                    factory
                            .newDocumentBuilder()
                            .parse(
                                    new ByteArrayInputStream(
                                            response.body()
                                                    .getBytes(
                                                            StandardCharsets.UTF_8
                                                    )
                                    )
                            );

            NodeList invoiceIds =
                    document.getElementsByTagNameNS(
                            "http://example.com/invoice",
                            "invoiceId"
                    );

            NodeList totalAmounts =
                    document.getElementsByTagNameNS(
                            "http://example.com/invoice",
                            "totalAmount"
                    );

            // Fallback for elements without namespace
            if (invoiceIds.getLength() == 0) {
                invoiceIds =
                        document.getElementsByTagName(
                                "invoiceId"
                        );
            }

            if (totalAmounts.getLength() == 0) {
                totalAmounts =
                        document.getElementsByTagName(
                                "totalAmount"
                        );
            }

            if (invoiceIds.getLength() == 0) {
                throw new RuntimeException(
                        "Invoice ID was not returned by SOAP service"
                );
            }

            String invoiceId =
                    invoiceIds
                            .item(0)
                            .getTextContent();

            String totalAmount =
                    totalAmounts.getLength() > 0
                            ? totalAmounts
                                .item(0)
                                .getTextContent()
                            : String.valueOf(
                                order.getTotalPrice()
                            );

            // Return SOAP result to frontend as JSON
            Map<String, Object> invoice =
                    new HashMap<>();

            invoice.put(
                    "invoiceId",
                    invoiceId
            );

            invoice.put(
                    "orderId",
                    order.getId()
            );

            invoice.put(
                    "customerName",
                    order.getCustomerName()
            );

            invoice.put(
                    "customerEmail",
                    order.getCustomerEmail()
            );

            invoice.put(
                    "totalAmount",
                    totalAmount
            );

            invoice.put(
                    "message",
                    "Invoice generated successfully using SOAP service"
            );

            return ResponseEntity.ok(invoice);

        } catch (Exception e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "error",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }
}