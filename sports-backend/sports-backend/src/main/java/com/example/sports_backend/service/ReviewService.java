 package com.example.sports_backend.service;

    import com.example.sports_backend.model.Review;
    import com.example.sports_backend.repository.ReviewRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.Optional;

    @Service
    public class ReviewService {

        // Inject the repository into this service
        @Autowired
        private ReviewRepository reviewRepository;

        // 1. Get all reviews
        public List<Review> getAllReviews() {
            return reviewRepository.findAll();
        }

        // 2. Get reviews for a specific product
        public List<Review> getReviewsByProduct(Long productId) {
            return reviewRepository.findByProductId(productId);
        }

        // 3. Add a new review with validation
        public Review addReview(Review review) {
            // Business Rule: rating must be between 1 and 5
            if (review.getRating() < 1 || review.getRating() > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5 stars");
            }

            // Set the current timestamp if not set
            if (review.getReviewDate() == null) {
                review.setReviewDate(LocalDateTime.now());
            }

            return reviewRepository.save(review);
        }

        // 4. Delete a review by ID
        public void deleteReview(Long reviewId) {
            reviewRepository.deleteById(reviewId);
        }
    }