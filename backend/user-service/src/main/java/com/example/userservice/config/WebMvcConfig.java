package com.example.userservice.config;

import com.example.userservice.config.interceptor.DeviceInfoInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final DeviceInfoInterceptor deviceInfoInterceptor;

    public WebMvcConfig(DeviceInfoInterceptor deviceInfoInterceptor) {
        this.deviceInfoInterceptor = deviceInfoInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(deviceInfoInterceptor)
                .addPathPatterns("/api/**");
    }
}