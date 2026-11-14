package com.example.sports_backend.repository;

import com.example.sports_backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    java.util.List<WishlistItem> findByWishlistId(Long wishlistId);
}
