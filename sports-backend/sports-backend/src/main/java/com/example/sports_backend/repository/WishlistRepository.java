package com.example.sports_backend.repository;

import com.example.sports_backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    java.util.Optional<Wishlist> findByCustomerId(Long customerId);
}
