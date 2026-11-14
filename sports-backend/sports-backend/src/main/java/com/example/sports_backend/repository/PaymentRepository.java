package com.example.sports_backend.repository;

import com.example.sports_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    java.util.Optional<Payment> findByOrderId(Long orderId);
    java.util.Optional<Payment> findByTransactionId(String transactionId);
}
