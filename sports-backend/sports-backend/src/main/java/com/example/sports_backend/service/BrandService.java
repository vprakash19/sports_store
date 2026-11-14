package com.example.sports_backend.service;

import com.example.sports_backend.model.Brand;
import com.example.sports_backend.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    @Autowired
    private BrandRepository repository;

    public List<Brand> getAll() {
        return repository.findAll();
    }

    public Optional<Brand> getById(Long id) {
        return repository.findById(id);
    }

    public Brand save(Brand entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }


}
