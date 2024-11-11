package com.g02.handyShare.borrow.entity;

import java.time.LocalDateTime;
import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.User.Entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Borrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who is borrowing the product (unidirectional many-to-one)
    @ManyToOne
    @JoinColumn(name = "borrower", referencedColumnName = "id", nullable = false)
    private User borrower;

    // The product being borrowed (unidirectional many-to-one, allows reuse of the product for multiple borrows)
    @ManyToOne
    @JoinColumn(name = "product", referencedColumnName = "id", nullable = false)
    private Product product;

    // Duration in days
    private int duration;

    // Amount associated with borrowing
    private int amount;

    // Store the start date and time
    @Column(name = "timerStart")
    private LocalDateTime timerStart;

    // Store the end date and time
    @Column(name = "timerEnd")
    private LocalDateTime timerEnd;

    // Penalty amount if applicable
    private int penalty;

    @PrePersist
    protected void onCreate() {
        timerStart = LocalDateTime.now();
       
    }
}
