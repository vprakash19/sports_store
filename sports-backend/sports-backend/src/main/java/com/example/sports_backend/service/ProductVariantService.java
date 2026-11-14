package com.example.sports_backend.service;

import com.example.sports_backend.model.ProductVariant;
import com.example.sports_backend.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductVariantService {

    @Autowired
    private ProductVariantRepository repository;

    public List<ProductVariant> getAll() {
        return repository.findAll();
    }

    public Optional<ProductVariant> getById(Long id) {
        return repository.findById(id);
    }

    public ProductVariant save(ProductVariant entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<ProductVariant> getByProductId(Long productId) {
        return repository.findByProductId(productId);
    }
    public java.util.Optional<ProductVariant> getBySku(String sku) {
        return repository.findBySku(sku);
    }
}
