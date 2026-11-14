package com.example.sports_backend.repository;

import com.example.sports_backend.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    java.util.Optional<Inventory> findByVariantId(Long variantId);
}
