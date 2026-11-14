package com.example.sports_backend.repository;

import com.example.sports_backend.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    java.util.Optional<Coupon> findByCouponCode(String couponCode);
    java.util.List<Coupon> findByIsActiveTrue();
}
