package com.g02.handyShare.borrow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.g02.handyShare.borrow.entity.Borrow;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    // Custom query to find all Borrow records for a specific borrower ID
    @Query("SELECT b FROM Borrow b WHERE b.borrower.id = :borrowerId")
    List<Borrow> findAllByBorrowerId(@Param("borrowerId") Long borrowerId);
}
