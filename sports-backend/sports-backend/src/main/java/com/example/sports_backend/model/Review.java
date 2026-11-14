
    package com.example.sports_backend.model;

    import jakarta.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Table(name = "reviews")
    public class Review {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "review_id")
        private Long reviewId;

        @Column(name = "customer_id", nullable = false)
        private Long customerId;

        @Column(name = "product_id", nullable = false)
        private Long productId;

        @Column(name = "rating", nullable = false)
        private Integer rating; // 1 to 5

        @Column(name = "review_text", columnDefinition = "TEXT")
        private String reviewText;

        @Column(name = "review_date")
        private LocalDateTime reviewDate;

        // Default constructor (required by JPA)
        public Review() {
        }

        // Constructor to easily create new reviews
        public Review(Long customerId, Long productId, Integer rating, String reviewText) {
            this.customerId = customerId;
            this.productId = productId;
            this.rating = rating;
            this.reviewText = reviewText;
            this.reviewDate = LocalDateTime.now();
        }

        // --- Getters and Setters ---
        public Long getReviewId() {
            return reviewId;
        }

        public void setReviewId(Long reviewId) {
            this.reviewId = reviewId;
        }

        public Long getCustomerId() {
            return customerId;
        }

        public void setCustomerId(Long customerId) {
            this.customerId = customerId;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getReviewText() {
            return reviewText;
        }

        public void setReviewText(String reviewText) {
            this.reviewText = reviewText;
        }

        public LocalDateTime getReviewDate() {
            return reviewDate;
        }

        public void setReviewDate(LocalDateTime reviewDate) {
            this.reviewDate = reviewDate;
        }
    }