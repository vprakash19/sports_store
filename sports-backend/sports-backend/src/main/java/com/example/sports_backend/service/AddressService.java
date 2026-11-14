package com.example.sports_backend.service;

import com.example.sports_backend.model.Address;
import com.example.sports_backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository repository;

    public List<Address> getAll() {
        return repository.findAll();
    }

    public Optional<Address> getById(Long id) {
        return repository.findById(id);
    }

    public Address save(Address entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public java.util.List<Address> getByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }
}
