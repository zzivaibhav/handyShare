package com.g02.handyShare.borrow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.g02.handyShare.Product.Entity.Product;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.borrow.entity.Borrow;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    // Custom query to find all Borrow records for a specific borrower ID
    @Query("SELECT b FROM Borrow b WHERE b.borrower.id = :borrowerId")
    List<Borrow> findAllByBorrowerId(@Param("borrowerId") Long borrowerId);
// Add this method to your BorrowRepository interface
@Query("SELECT b FROM Borrow b WHERE b.product.lender.id = :lenderId")
List<Borrow> findAllByLenderId(@Param("lenderId") Long lenderId);

@Query("SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END " +
"FROM Borrow b WHERE b.product = :product " +
"AND b.borrower = :borrower " +
"AND b.timerEnd > :timerStart " +
"AND b.timerStart < :timerEnd")
boolean existsByBorrowerAndProductAndOverlappingTime(
 @Param("borrower") User borrower,
 @Param("product") Product product,
 @Param("timerStart") LocalDateTime timerStart,
 @Param("timerEnd") LocalDateTime timerEnd);

}
