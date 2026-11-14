package com.example.sports_backend.repository;

import com.example.sports_backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    java.util.List<Address> findByCustomerId(Long customerId);
}
