package com.example.sports_backend.repository;

import com.example.sports_backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    java.util.List<CartItem> findByCartId(Long cartId);
    void deleteByCartId(Long cartId);
}
