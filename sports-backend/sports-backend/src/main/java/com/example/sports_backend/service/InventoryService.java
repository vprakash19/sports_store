package com.example.sports_backend.service;

import com.example.sports_backend.model.Inventory;
import com.example.sports_backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    public List<Inventory> getAll() {
        return repository.findAll();
    }

    public Optional<Inventory> getById(Long id) {
        return repository.findById(id);
    }

    public Inventory save(Inventory entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.Optional<Inventory> getByVariantId(Long variantId) {
        return repository.findByVariantId(variantId);
    }
}
