package com.example.sports_backend.service;

import com.example.sports_backend.model.Cart;
import com.example.sports_backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository repository;

    public List<Cart> getAll() {
        return repository.findAll();
    }

    public Optional<Cart> getById(Long id) {
        return repository.findById(id);
    }

    public Cart save(Cart entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.Optional<Cart> getByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }
}
