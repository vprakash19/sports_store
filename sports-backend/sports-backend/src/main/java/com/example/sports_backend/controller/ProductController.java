package com.example.sports_backend.controller;

import com.example.sports_backend.model.Product;
import com.example.sports_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product entity) {
        return service.getById(id).map(existing -> {
            entity.setProductId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/subcategory/{subcategoryId}")
    public org.springframework.http.ResponseEntity<java.util.List<Product>> getBySubcategory(@PathVariable Long subcategoryId) {
        return org.springframework.http.ResponseEntity.ok(service.getBySubcategoryId(subcategoryId));
    }
    @GetMapping("/brand/{brandId}")
    public org.springframework.http.ResponseEntity<java.util.List<Product>> getByBrand(@PathVariable Long brandId) {
        return org.springframework.http.ResponseEntity.ok(service.getByBrandId(brandId));
    }
    @GetMapping("/active")
    public org.springframework.http.ResponseEntity<java.util.List<Product>> getActive() {
        return org.springframework.http.ResponseEntity.ok(service.getActiveProducts());
    }
}
