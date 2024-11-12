package com.g02.handyShare.Review.Dto;

public class ReviewRequest {
    private Long userId;
    private Long productId;
    private String reviewText;  // Updated to reflect 'review'
    private int rating;
    private String image;  // Optional image URL or path

    // Getters and setters
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
        return reviewText;  // Updated to reflect 'review'
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;  // Updated to reflect 'review'
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
