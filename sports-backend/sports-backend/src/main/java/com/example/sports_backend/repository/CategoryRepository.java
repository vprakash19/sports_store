package com.example.sports_backend.repository;

import com.example.sports_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    java.util.Optional<Category> findByCategoryName(String categoryName);
}
