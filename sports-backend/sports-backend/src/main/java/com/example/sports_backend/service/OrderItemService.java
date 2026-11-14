package com.example.sports_backend.service;

import com.example.sports_backend.model.OrderItem;
import com.example.sports_backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository repository;

    public List<OrderItem> getAll() {
        return repository.findAll();
    }

    public Optional<OrderItem> getById(Long id) {
        return repository.findById(id);
    }

    public OrderItem save(OrderItem entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<OrderItem> getByOrderId(Long orderId) {
        return repository.findByOrderId(orderId);
    }
}
