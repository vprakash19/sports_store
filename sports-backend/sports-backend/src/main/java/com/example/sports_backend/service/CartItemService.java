package com.example.sports_backend.service;

import com.example.sports_backend.model.CartItem;
import com.example.sports_backend.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository repository;

    public List<CartItem> getAll() {
        return repository.findAll();
    }

    public Optional<CartItem> getById(Long id) {
        return repository.findById(id);
    }

    public CartItem save(CartItem entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<CartItem> getByCartId(Long cartId) {
        return repository.findByCartId(cartId);
    }
    @org.springframework.transaction.annotation.Transactional
    public void clearCart(Long cartId) {
        repository.deleteByCartId(cartId);
    }
}
