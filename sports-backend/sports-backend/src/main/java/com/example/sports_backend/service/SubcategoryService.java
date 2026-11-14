package com.example.sports_backend.service;

import com.example.sports_backend.model.Subcategory;
import com.example.sports_backend.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository repository;

    public List<Subcategory> getAll() {
        return repository.findAll();
    }

    public Optional<Subcategory> getById(Long id) {
        return repository.findById(id);
    }

    public Subcategory save(Subcategory entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<Subcategory> getByCategoryId(Long categoryId) {
        return repository.findByCategoryId(categoryId);
    }
}
