package com.example.sports_backend.controller;

import com.example.sports_backend.model.WishlistItem;
import com.example.sports_backend.service.WishlistItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist-items")
public class WishlistItemController {

    @Autowired
    private WishlistItemService service;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WishlistItem> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WishlistItem> create(@RequestBody WishlistItem entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WishlistItem> update(@PathVariable Long id, @RequestBody WishlistItem entity) {
        return service.getById(id).map(existing -> {
            entity.setWishlistItemId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/wishlist/{wishlistId}")
    public org.springframework.http.ResponseEntity<java.util.List<WishlistItem>> getByWishlist(@PathVariable Long wishlistId) {
        return org.springframework.http.ResponseEntity.ok(service.getByWishlistId(wishlistId));
    }
}
