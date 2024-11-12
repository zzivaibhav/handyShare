package com.g02.handyShare.Review.Service;

import com.g02.handyShare.Review.Entity.Review;  
import com.g02.handyShare.Review.Repository.ReviewRepository;  
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;  

    public List<Review> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductId(productId);  
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByUserId(userId);  
    }

    public Review createReview(Long userId, Long productId, String reviewText, int rating, String image) {
        Review review = new Review(userId, productId, reviewText, rating, image);  
        return reviewRepository.save(review);  
    }
}
