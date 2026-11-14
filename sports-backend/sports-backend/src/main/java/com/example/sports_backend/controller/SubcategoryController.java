package com.example.sports_backend.controller;

import com.example.sports_backend.model.Subcategory;
import com.example.sports_backend.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService service;

    @GetMapping
    public ResponseEntity<List<Subcategory>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subcategory> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Subcategory> create(@RequestBody Subcategory entity) {
        return new ResponseEntity<>(service.save(entity), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subcategory> update(@PathVariable Long id, @RequestBody Subcategory entity) {
        return service.getById(id).map(existing -> {
            entity.setSubcategoryId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public org.springframework.http.ResponseEntity<java.util.List<Subcategory>> getByCategoryId(@PathVariable Long categoryId) {
        return org.springframework.http.ResponseEntity.ok(service.getByCategoryId(categoryId));
    }
}
