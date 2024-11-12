package com.g02.handyShare.Review.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long productId;
    private String reviewText;  
    private int rating;
    private String image;  // Optional image field


    public Review() {
        // Default constructor for JPA
    }    

    public Review(Long userId, Long productId, String reviewText, int rating, String image) {
        this.userId = userId;
        this.productId = productId;
        this.reviewText = reviewText;  
        this.rating = rating;
        this.image = image;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getReviewText() {
        return reviewText;  
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;  
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
