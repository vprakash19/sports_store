package com.example.sports_backend.service;

import com.example.sports_backend.model.Order;
import com.example.sports_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    public List<Order> getAll() {
        return repository.findAll();
    }

    public Optional<Order> getById(Long id) {
        return repository.findById(id);
    }

    public Order save(Order entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<Order> getByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }
    public java.util.List<Order> getByOrderStatus(String orderStatus) {
        return repository.findByOrderStatus(orderStatus);
    }
}
