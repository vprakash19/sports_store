package com.example.sports_backend.service;

import com.example.sports_backend.model.WishlistItem;
import com.example.sports_backend.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistItemService {

    @Autowired
    private WishlistItemRepository repository;

    public List<WishlistItem> getAll() {
        return repository.findAll();
    }

    public Optional<WishlistItem> getById(Long id) {
        return repository.findById(id);
    }

    public WishlistItem save(WishlistItem entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<WishlistItem> getByWishlistId(Long wishlistId) {
        return repository.findByWishlistId(wishlistId);
    }
}
