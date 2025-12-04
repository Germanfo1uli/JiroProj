package com.example.userservice.config.interceptor;

import com.example.userservice.util.DeviceInfoNormalizer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class DeviceInfoInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userAgent = request.getHeader("User-Agent");
        String fingerprint = DeviceInfoNormalizer.getDeviceFingerprint(userAgent);

        request.setAttribute("deviceFingerprint", fingerprint);
        return true;
    }
}