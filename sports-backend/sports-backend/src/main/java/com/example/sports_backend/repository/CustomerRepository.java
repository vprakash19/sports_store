package com.example.sports_backend.repository;

import com.example.sports_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    java.util.Optional<Customer> findByEmail(String email);
}
