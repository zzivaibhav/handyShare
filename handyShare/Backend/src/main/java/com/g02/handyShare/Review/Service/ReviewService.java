package com.g02.handyShare.Review.Service;

import com.g02.handyShare.Review.Entity.Review;
import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByProductId(Long productId);
}
