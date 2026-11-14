package com.example.sports_backend.repository;

import com.example.sports_backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    java.util.Optional<Cart> findByCustomerId(Long customerId);
}
