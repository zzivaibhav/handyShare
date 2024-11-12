package com.g02.handyShare.borrow.service;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import com.g02.handyShare.Product.Service.CustomException;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.g02.handyShare.borrow.entity.Borrow;
import com.g02.handyShare.borrow.repository.BorrowRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    BorrowRepository borrowRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @Scheduled(fixedRate = 6000)
    @Transactional
    public void checkAndUpdateAvailability() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<Borrow> borrows = borrowRepository.findAll();

        for (Borrow borrow : borrows) {
            Product product = borrow.getProduct();
            LocalDateTime startTime = borrow.getTimerStart();
            LocalDateTime endTime = borrow.getTimerEnd();

            // Check start time - make unavailable
            if (currentTime.isEqual(startTime) || 
                (currentTime.isAfter(startTime) && currentTime.isBefore(endTime))) {
                product.setAvailable(false);
                productRepository.save(product);
                System.out.println("Product " + product.getId() + " set to unavailable. Borrow start time: " + startTime);
            }

            // Check end time - make available
            if (currentTime.isEqual(endTime) || currentTime.isAfter(endTime)) {
                product.setAvailable(true);
                productRepository.save(product);
                System.out.println("Product " + product.getId() + " set to available. Borrow end time: " + endTime);
            }
        }
    }

   public Borrow addBorrowTransaction(Borrow borrowInstance) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user = userRepository.findByEmail(authentication.getName());
    Product product = productRepository.findById(borrowInstance.getProduct().getId())
            .orElseThrow(() -> new CustomException("Product not found with id: " + borrowInstance.getProduct().getId()));

    System.out.println(product);

    borrowInstance.setBorrower(user);
    borrowInstance.setProduct(product);

    // Set timerStart using the passed date and time
    LocalDateTime timerStart = borrowInstance.getTimerStart();
    if (timerStart == null) {
        throw new CustomException("Start time is required.");
    }

    // Calculate the end time based on the duration
    int durationInHours = borrowInstance.getDuration();
    LocalDateTime endTimer = timerStart.plusHours(durationInHours);
    borrowInstance.setTimerEnd(endTimer);

    // Check if there is an existing overlapping booking for the same product by the same user
    boolean isOverlap = borrowRepository.existsByBorrowerAndProductAndOverlappingTime(
            user, product, timerStart, endTimer);

    if (isOverlap) {
        throw new CustomException("The product is already booked by you for the selected time period.");
    }

    // Save the borrow instance
     productRepository.save(product);
    return borrowRepository.save(borrowInstance);
}

    public List<Borrow> getBorrowedItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User borrower = userRepository.findByEmail(email);

        // Fetch all Borrow records for the authenticated user
        return borrowRepository.findAllByBorrowerId(borrower.getId());
    }


    public List<Borrow> getLendedItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User lender = userRepository.findByEmail(email);
        System.out.println("Authenticated User ID: " + lender.getId());


        // Fetch all Borrow records for the authenticated user
        return borrowRepository.findAllByLenderId(lender.getId());
    }


}
