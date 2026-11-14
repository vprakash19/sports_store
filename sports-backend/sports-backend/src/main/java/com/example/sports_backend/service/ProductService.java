package com.example.sports_backend.service;

import com.example.sports_backend.model.Product;
import com.example.sports_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Optional<Product> getById(Long id) {
        return repository.findById(id);
    }

    public Product save(Product entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<Product> getBySubcategoryId(Long subcategoryId) {
        return repository.findBySubcategoryId(subcategoryId);
    }
    public java.util.List<Product> getByBrandId(Long brandId) {
        return repository.findByBrandId(brandId);
    }
    public java.util.List<Product> getActiveProducts() {
        return repository.findByIsActiveTrue();
    }
}
