package com.example.sports_backend.controller;

import com.example.sports_backend.model.CartItem;
import com.example.sports_backend.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService service;

    @GetMapping
    public ResponseEntity<List<CartItem>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CartItem> create(@RequestBody CartItem entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> update(@PathVariable Long id, @RequestBody CartItem entity) {
        return service.getById(id).map(existing -> {
            entity.setCartItemId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cart/{cartId}")
    public org.springframework.http.ResponseEntity<java.util.List<CartItem>> getByCart(@PathVariable Long cartId) {
        return org.springframework.http.ResponseEntity.ok(service.getByCartId(cartId));
    }
    @DeleteMapping("/cart/{cartId}/clear")
    public org.springframework.http.ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        service.clearCart(cartId);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
