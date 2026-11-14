package com.example.sports_backend.service;

import com.example.sports_backend.model.ProductImage;
import com.example.sports_backend.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository repository;

    public List<ProductImage> getAll() {
        return repository.findAll();
    }

    public Optional<ProductImage> getById(Long id) {
        return repository.findById(id);
    }

    public ProductImage save(ProductImage entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<ProductImage> getByProductId(Long productId) {
        return repository.findByProductId(productId);
    }
}
