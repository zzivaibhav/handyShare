package com.g02.handyShare.Review.Service;

import com.g02.handyShare.Review.Entity.Review;  // Updated to import 'Review'
import com.g02.handyShare.Review.Repository.ReviewRepository;  // Updated to use 'ReviewRepository'
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;  // Updated to 'ReviewRepository'

    // Get reviews for a specific product
    public List<Review> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductId(productId);  // Updated method name to 'findByProductId'
    }

    // Get reviews provided by a specific user
    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByUserId(userId);  // Updated method name to 'findByUserId'
    }

    // Create new review for a product by a user
    public Review createReview(Long userId, Long productId, String reviewText, int rating, String image) {
        Review review = new Review(userId, productId, reviewText, rating, image);  // Updated to 'Review' and 'reviewText'
        return reviewRepository.save(review);  // Updated to 'reviewRepository'
    }
}
