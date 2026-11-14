package com.example.sports_backend.controller;

import com.example.sports_backend.model.ProductVariant;
import com.example.sports_backend.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService service;

    @GetMapping
    public ResponseEntity<List<ProductVariant>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariant> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductVariant> create(@RequestBody ProductVariant entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariant> update(@PathVariable Long id, @RequestBody ProductVariant entity) {
        return service.getById(id).map(existing -> {
            entity.setVariantId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public org.springframework.http.ResponseEntity<java.util.List<ProductVariant>> getByProduct(@PathVariable Long productId) {
        return org.springframework.http.ResponseEntity.ok(service.getByProductId(productId));
    }
    @GetMapping("/sku/{sku}")
    public org.springframework.http.ResponseEntity<ProductVariant> getBySku(@PathVariable String sku) {
        return service.getBySku(sku).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}
