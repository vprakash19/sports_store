package com.example.sports_backend.repository;

import com.example.sports_backend.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    java.util.List<ProductVariant> findByProductId(Long productId);
    java.util.Optional<ProductVariant> findBySku(String sku);
}
