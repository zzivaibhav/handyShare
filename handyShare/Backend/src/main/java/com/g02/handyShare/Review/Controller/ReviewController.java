package com.g02.handyShare.Review.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g02.handyShare.Review.Dto.ReviewRequest; 
import com.g02.handyShare.Review.Dto.ReviewResponse;
import com.g02.handyShare.Review.Entity.Review; 
import com.g02.handyShare.Review.Service.ReviewService; 

@RestController
@RequestMapping("/api/v1/user")  
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;  

    // Endpoint to get reviews for a product
    @GetMapping("/review-product/{productId}")
    public List<Review> getReviewsForProduct(@PathVariable Long productId) {
        return reviewService.getReviewsForProduct(productId);  
    }

    // Endpoint to get reviews given by a user
    @GetMapping("/review-user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewService.getReviewsForUser(userId);  
    }

    // Endpoint to create new review
    @PostMapping("/review-create")
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest reviewRequest) {
        // Using ReviewService to create the review
        Review review = reviewService.createReview(
                reviewRequest.getUserId(),
                reviewRequest.getProductId(),
                reviewRequest.getReviewText(),
                reviewRequest.getRating(),
                reviewRequest.getImage()  
        );

        ReviewResponse response = new ReviewResponse("Review created successfully", review);

        return new ResponseEntity<ReviewResponse>(response, HttpStatus.CREATED);
    }
    
}