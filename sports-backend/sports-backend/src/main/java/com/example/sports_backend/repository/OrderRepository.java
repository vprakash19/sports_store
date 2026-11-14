package com.example.sports_backend.repository;

import com.example.sports_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByCustomerId(Long customerId);
    java.util.List<Order> findByOrderStatus(String orderStatus);
}
