package com.example.sports_backend.repository;

import com.example.sports_backend.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    java.util.List<ProductImage> findByProductId(Long productId);
}
