package com.example.sports_backend.controller;

import com.example.sports_backend.model.ProductImage;
import com.example.sports_backend.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {

    @Autowired
    private ProductImageService service;

    @GetMapping
    public ResponseEntity<List<ProductImage>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductImage> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductImage> create(@RequestBody ProductImage entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductImage> update(@PathVariable Long id, @RequestBody ProductImage entity) {
        return service.getById(id).map(existing -> {
            entity.setImageId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public org.springframework.http.ResponseEntity<java.util.List<ProductImage>> getByProduct(@PathVariable Long productId) {
        return org.springframework.http.ResponseEntity.ok(service.getByProductId(productId));
    }
}
