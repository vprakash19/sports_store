package com.example.sports_backend.controller;

import com.example.sports_backend.model.Order;
import com.example.sports_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order entity) {
        return service.getById(id).map(existing -> {
            entity.setOrderId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    public org.springframework.http.ResponseEntity<java.util.List<Order>> getByCustomer(@PathVariable Long customerId) {
        return org.springframework.http.ResponseEntity.ok(service.getByCustomerId(customerId));
    }
    @GetMapping("/status/{status}")
    public org.springframework.http.ResponseEntity<java.util.List<Order>> getByStatus(@PathVariable String status) {
        return org.springframework.http.ResponseEntity.ok(service.getByOrderStatus(status));
    }
}
