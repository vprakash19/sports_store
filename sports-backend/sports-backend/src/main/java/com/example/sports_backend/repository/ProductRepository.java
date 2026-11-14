package com.example.sports_backend.repository;

import com.example.sports_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    java.util.List<Product> findBySubcategoryId(Long subcategoryId);
    java.util.List<Product> findByBrandId(Long brandId);
    java.util.List<Product> findByIsActiveTrue();
}
