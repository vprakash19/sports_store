package com.example.sports_backend.repository;

import com.example.sports_backend.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    java.util.Optional<Brand> findByBrandName(String brandName);
}
