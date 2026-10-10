package com.example.order_service.soap;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.w3c.dom.Element;

@Endpoint
public class InvoiceEndpoint {

    private static final String NAMESPACE_URI =
            "http://example.com/invoice";

    @PayloadRoot(
            namespace = NAMESPACE_URI,
            localPart = "generateInvoiceRequest")
    @ResponsePayload
    public Element generateInvoice(
            @RequestPayload Element request) {

        return createResponse(request);
    }

    private Element createResponse(Element request) {

        String orderId = request
                .getElementsByTagName("orderId")
                .item(0)
                .getTextContent();

        String totalAmount = request
                .getElementsByTagName("totalAmount")
                .item(0)
                .getTextContent();

        try {
            javax.xml.parsers.DocumentBuilderFactory factory =
                    javax.xml.parsers.DocumentBuilderFactory
                            .newInstance();

            org.w3c.dom.Document document =
                    factory.newDocumentBuilder().newDocument();

            Element response =
                    document.createElementNS(
                            NAMESPACE_URI,
                            "generateInvoiceResponse");

            Element invoiceId =
                    document.createElement("invoiceId");

            invoiceId.setTextContent("INV-" + orderId);

            Element amount =
                    document.createElement("totalAmount");

            amount.setTextContent(totalAmount);

            response.appendChild(invoiceId);
            response.appendChild(amount);

            return response;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to generate invoice", e);
        }
    }
}