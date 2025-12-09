package com.example.issueservice.client;

import com.example.issueservice.config.BoardServiceClientConfig;
import com.example.issueservice.dto.response.UserPermissionsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "board-service",
        path = "api/internal",
        configuration = BoardServiceClientConfig.class
)
public interface BoardServiceClient {

    @GetMapping("/permissions")
    UserPermissionsResponse getUserPermissions(
            @RequestParam Long userId,
            @RequestParam Long projectId
    );
}