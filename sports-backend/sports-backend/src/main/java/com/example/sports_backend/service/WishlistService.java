package com.example.sports_backend.service;

import com.example.sports_backend.model.Wishlist;
import com.example.sports_backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository repository;

    public List<Wishlist> getAll() {
        return repository.findAll();
    }

    public Optional<Wishlist> getById(Long id) {
        return repository.findById(id);
    }

    public Wishlist save(Wishlist entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.Optional<Wishlist> getByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }
}
