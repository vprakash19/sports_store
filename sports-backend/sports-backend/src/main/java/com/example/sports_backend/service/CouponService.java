package com.example.sports_backend.service;

import com.example.sports_backend.model.Coupon;
import com.example.sports_backend.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    @Autowired
    private CouponRepository repository;

    public List<Coupon> getAll() {
        return repository.findAll();
    }

    public Optional<Coupon> getById(Long id) {
        return repository.findById(id);
    }

    public Coupon save(Coupon entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.Optional<Coupon> getByCouponCode(String couponCode) {
        return repository.findByCouponCode(couponCode);
    }
    public java.util.List<Coupon> getActiveCoupons() {
        return repository.findByIsActiveTrue();
    }
}
