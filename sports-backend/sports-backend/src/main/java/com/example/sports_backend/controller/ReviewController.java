 package com.example.sports_backend.controller;

    import com.example.sports_backend.model.Review;
    import com.example.sports_backend.service.ReviewService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/reviews")
    public class ReviewController {

        @Autowired
        private ReviewService reviewService;

        // GET http://localhost:8080/api/reviews
        @GetMapping
        public ResponseEntity<List<Review>> getAllReviews() {
            List<Review> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        }

        // GET http://localhost:8080/api/reviews/product/1
        @GetMapping("/product/{productId}")
        public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
            List<Review> reviews = reviewService.getReviewsByProduct(productId);
            return ResponseEntity.ok(reviews);
        }

        // POST http://localhost:8080/api/reviews
        @PostMapping
        public ResponseEntity<?> createReview(@RequestBody Review review) {
            try {
                Review savedReview = reviewService.addReview(review);
                return new ResponseEntity<>(savedReview, HttpStatus.CREATED); // 201 Created
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
            }
        }

        // DELETE http://localhost:8080/api/reviews/1
        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteReview(@PathVariable Long id) {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Review deleted successfully!");
        }
    }