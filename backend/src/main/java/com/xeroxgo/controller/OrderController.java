package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.CreateOrderRequest;
import com.xeroxgo.dto.OrderDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.entity.User;
import com.xeroxgo.service.AuthService;
import com.xeroxgo.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.createOrder(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<OrderDto>>> getUserOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PagedResponse<OrderDto> orders = orderService.getUserOrders(currentUser.getId(), status, page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long orderId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.getOrderDetails(orderId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByReference(@PathVariable String reference) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.getOrderByReference(reference, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(@PathVariable Long orderId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        OrderDto cancelled = orderService.cancelOrder(orderId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", cancelled));
    }
}
