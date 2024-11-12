package com.g02.handyShare.Review.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g02.handyShare.Review.Dto.ReviewRequest; // Updated import to ReviewRequest
import com.g02.handyShare.Review.Entity.Review; // Updated to use Review entity
import com.g02.handyShare.Review.Service.ReviewService; // Updated to use ReviewService

@RestController
@RequestMapping("/api/v1/all/review")  // Path changed to reflect 'review'
public class ReviewController {

    @Autowired
    private ReviewService reviewService;  // Autowire ReviewService

    // Endpoint to get reviews for a product
    @GetMapping("/product/{productId}")
    public List<Review> getReviewsForProduct(@PathVariable Long productId) {
        return reviewService.getReviewsForProduct(productId);  // Calls ReviewService
    }

    // Endpoint to get reviews given by a user
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewService.getReviewsForUser(userId);  // Calls ReviewService
    }

    // Endpoint to create new review
    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest reviewRequest) {
        // Using ReviewService to create the review
        Review review = reviewService.createReview(
                reviewRequest.getUserId(),
                reviewRequest.getProductId(),
                reviewRequest.getReviewText(),
                reviewRequest.getRating(),
                reviewRequest.getImage()  // Assuming reviewRequest includes image
        );

        // Return created review with 201 HTTP status
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
}
