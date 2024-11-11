package com.g02.handyShare.borrow.service;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import com.g02.handyShare.Product.Service.CustomException;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g02.handyShare.borrow.entity.Borrow;
import com.g02.handyShare.borrow.repository.BorrowRepository;
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

    public Borrow addBorrowTransaction(Borrow borrowInstance) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName());
        Product product = productRepository.findById(borrowInstance.getProduct().getId())
                .orElseThrow(() -> new CustomException("Product not found with id: "));

        System.out.println(product);

        borrowInstance.setBorrower(user);
        product.setAvailable(false);
        borrowInstance.setProduct(product);

        // Set timerStart using the passed date and time
        LocalDateTime timerStart = borrowInstance.getTimerStart();

        if (timerStart == null) {
            throw new CustomException("Start time is required.");
        }

        // Calculate the end_timer based on the duration
        int durationInHours = borrowInstance.getDuration();
        LocalDateTime endTimer = timerStart.plusHours(durationInHours);
        borrowInstance.setTimerEnd(endTimer);

        borrowRepository.save(borrowInstance);
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
