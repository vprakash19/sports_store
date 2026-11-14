package com.example.sports_backend.service;

import com.example.sports_backend.model.Payment;
import com.example.sports_backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    public List<Payment> getAll() {
        return repository.findAll();
    }

    public Optional<Payment> getById(Long id) {
        return repository.findById(id);
    }

    public Payment save(Payment entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.Optional<Payment> getByOrderId(Long orderId) {
        return repository.findByOrderId(orderId);
    }
    public java.util.Optional<Payment> getByTransactionId(String transactionId) {
        return repository.findByTransactionId(transactionId);
    }
}
