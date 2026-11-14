package com.example.sports_backend.repository;

import com.example.sports_backend.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    java.util.List<Subcategory> findByCategoryId(Long categoryId);
}
