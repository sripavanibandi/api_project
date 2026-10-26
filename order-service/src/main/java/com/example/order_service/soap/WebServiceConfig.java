package com.example.order_service.soap;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@Configuration
@EnableWs
public class WebServiceConfig {

    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {

        MessageDispatcherServlet servlet =
                new MessageDispatcherServlet();

        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);

        ServletRegistrationBean<MessageDispatcherServlet> registration =
                new ServletRegistrationBean<>(
                        servlet,
                        "/ws/*");

        registration.setName("messageDispatcherServlet");
        registration.setLoadOnStartup(1);

        return registration;
    }

    @Bean
    public XsdSchema invoiceSchema() {
        return new SimpleXsdSchema(
                new org.springframework.core.io.ClassPathResource(
                        "wsdl/invoice.xsd"));
    }

    @Bean(name = "invoice")
    public DefaultWsdl11Definition invoiceWsdl(
            XsdSchema invoiceSchema) {

        DefaultWsdl11Definition wsdl =
                new DefaultWsdl11Definition();

        wsdl.setPortTypeName("InvoicePort");
        wsdl.setLocationUri("/ws");
        wsdl.setTargetNamespace("http://example.com/invoice");
        wsdl.setSchema(invoiceSchema);

        return wsdl;
    }
}