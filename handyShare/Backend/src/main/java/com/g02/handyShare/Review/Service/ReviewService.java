package com.g02.handyShare.Review.Service;

import com.g02.handyShare.Review.Dto.ReviewWithUserDTO;
import com.g02.handyShare.Review.Entity.Review;  
import com.g02.handyShare.Review.Repository.ReviewRepository;
import com.g02.handyShare.User.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;  

    @Autowired
    private UserRepository userRepository;

        public List<ReviewWithUserDTO> getReviewsForProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        
        return reviews.stream().map(review -> {
            String username = userRepository.findById(review.getUserId())
                                .map(user -> user.getName())
                                .orElse("Anonymous"); 
            return new ReviewWithUserDTO(
                review.getId(),
                username,
                review.getProductId(),
                review.getReviewText(),
                review.getRating(),
                review.getImage()
            );
        }).collect(Collectors.toList());
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByUserId(userId);  
    }

    public Review createReview(Long userId, Long productId, String reviewText, int rating, String image) {
        Review review = new Review(userId, productId, reviewText, rating, image);  
        return reviewRepository.save(review);  
    }
}
