package com.example.issueservice.config;

import feign.Request;
import feign.Retryer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BoardServiceClientConfig {

    @Value("${board.service.token}")
    private String boardServiceToken;

    @Bean
    public InternalAuthInterceptor interServiceAuthInterceptor() {
        return new InternalAuthInterceptor(boardServiceToken);
    }

    @Bean
    public Request.Options feignOptions() {
        return new Request.Options(3000, 10000); // timeout: 3s connect, 10s read
    }

    @Bean
    public Retryer feignRetryer() {
        return new Retryer.Default(100, 1000, 3); // 3 попытки
    }
}