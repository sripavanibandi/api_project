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

        org.w3c.dom.NodeList orderIdNodes = request.getElementsByTagNameNS(NAMESPACE_URI, "orderId");
        if (orderIdNodes.getLength() == 0) {
            orderIdNodes = request.getElementsByTagName("orderId");
        }
        String orderId = (orderIdNodes.getLength() > 0 && orderIdNodes.item(0) != null)
                ? orderIdNodes.item(0).getTextContent().trim()
                : "UNKNOWN";

        org.w3c.dom.NodeList totalAmountNodes = request.getElementsByTagNameNS(NAMESPACE_URI, "totalAmount");
        if (totalAmountNodes.getLength() == 0) {
            totalAmountNodes = request.getElementsByTagName("totalAmount");
        }
        String totalAmount = (totalAmountNodes.getLength() > 0 && totalAmountNodes.item(0) != null)
                ? totalAmountNodes.item(0).getTextContent().trim()
                : "0.0";

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