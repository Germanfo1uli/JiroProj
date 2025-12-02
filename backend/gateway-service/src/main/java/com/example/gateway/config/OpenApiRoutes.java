package com.example.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiRoutes {

    @Bean
    public RouteLocator apiDocsRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service-docs", r -> r
                        .path("/v3/api-docs/user-service")
                        .filters(f -> f.rewritePath("/v3/api-docs/user-service", "/v3/api-docs"))
                        .uri("lb://user-service"))
                .route("board-service-docs", r -> r
                        .path("/v3/api-docs/board-service")
                        .filters(f -> f.rewritePath("/v3/api-docs/board-service", "/v3/api-docs"))
                        .uri("lb://board-service"))
                .route("report-service-docs", r -> r
                        .path("/v3/api-docs/report-service")
                        .filters(f -> f.rewritePath("/v3/api-docs/report-service", "/v3/api-docs"))
                        .uri("lb://report-service"))
                .build();
    }
}