package com.example.sports_backend.repository;

    import com.example.sports_backend.model.Review;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;
    import java.util.List;

    @Repository
    public interface ReviewRepository extends JpaRepository<Review, Long> {

        // Custom query method: find all reviews for a specific product
        List<Review> findByProductId(Long productId);

        // Custom query method: find all reviews by a specific customer
        List<Review> findByCustomerId(Long customerId);
    }