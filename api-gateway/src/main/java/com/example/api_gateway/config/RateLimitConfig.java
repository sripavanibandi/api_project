package com.example.api_gateway.config;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class RateLimitConfig implements GlobalFilter, Ordered {

    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_SECONDS = 60;

    private final ConcurrentHashMap<String, RequestCounter> counters =
            new ConcurrentHashMap<>();

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String clientIp = getClientIp(exchange);

        RequestCounter counter = counters.computeIfAbsent(
                clientIp,
                key -> new RequestCounter());

        long currentTime = Instant.now().getEpochSecond();

        synchronized (counter) {

            if (currentTime - counter.windowStart >= WINDOW_SECONDS) {
                counter.windowStart = currentTime;
                counter.requestCount.set(0);
            }

            int requests = counter.requestCount.incrementAndGet();

            if (requests > MAX_REQUESTS) {

                exchange.getResponse()
                        .setStatusCode(HttpStatus.TOO_MANY_REQUESTS);

                return exchange.getResponse().setComplete();
            }
        }

        return chain.filter(exchange);
    }

    private String getClientIp(ServerWebExchange exchange) {

        String forwardedFor = exchange.getRequest()
                .getHeaders()
                .getFirst("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        if (exchange.getRequest().getRemoteAddress() != null) {
            return exchange.getRequest()
                    .getRemoteAddress()
                    .getAddress()
                    .getHostAddress();
        }

        return "unknown";
    }

    @Override
    public int getOrder() {
        return -2;
    }

    private static class RequestCounter {

        private long windowStart = Instant.now().getEpochSecond();

        private final AtomicInteger requestCount =
                new AtomicInteger(0);
    }
}