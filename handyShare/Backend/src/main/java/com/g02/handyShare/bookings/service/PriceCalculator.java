package com.g02.handyShare.bookings.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g02.handyShare.Config.Firebase.FirebaseService;
import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.Product.Repository.ProductRepository;
import com.g02.handyShare.User.Repository.UserRepository;
import com.g02.handyShare.bookings.entity.Bookings;
import com.g02.handyShare.bookings.repository.BookingRepository;

@Service
public class PriceCalculator {

       @Autowired
    BookingRepository bookingRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

 private FirebaseService firebaseService;

 public double calculatePayment(LocalDateTime returnTime, LocalDateTime timerEnd, Bookings borrowInstance, Product product){
    if (returnTime.isAfter(timerEnd)) {
        // Only calculate penalty if returnTime is after the grace period
        LocalDateTime gracePeriodEnd = timerEnd.plusMinutes(30);

        float plateFormFees = 0.05f;

        if (returnTime.isAfter(gracePeriodEnd)) {
            // Calculate extra time in hours (round up to nearest hour)
            long extraMinutes = Duration.between(gracePeriodEnd, returnTime).toMinutes();
            long extraHours = (extraMinutes + 59) / 60; // Round up minutes to the nearest hour

            double extraPenalty = (product.getRentalPrice()+(plateFormFees *product.getRentalPrice())) * extraHours;
            borrowInstance.setPenalty(extraPenalty);
            bookingRepository.save(borrowInstance);
            System.out.println("-------------------------------------------------"+extraPenalty);
        }
    } else {
        // No penalty if returned on time
        borrowInstance.setPenalty(0.0);
     }

    
     float charge = 0.02f;
    Double initialPrice =  (borrowInstance.getDuration() * product.getRentalPrice())+borrowInstance.getPenalty() ;
    Double plateFormFees =   initialPrice*charge;
    Double price = initialPrice + plateFormFees;
    System.out.println("-----------------------------------------------------------------------------------------"+price);

 return price;
 }
  
}
