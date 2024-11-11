package com.g02.handyShare.borrow.controller;

import com.g02.handyShare.Product.Entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.g02.handyShare.borrow.entity.Borrow;
import com.g02.handyShare.borrow.service.BorrowService;

import jakarta.validation.constraints.Positive;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "http://172.17.0.99:3000", allowCredentials = "true" )

public class BorrowController {

@Autowired
BorrowService borrowService;

    @PostMapping("/user/borrowProduct")
    public ResponseEntity<?> borrowItem(@RequestBody Borrow borrowInstance){
        
        Borrow response = borrowService.addBorrowTransaction(borrowInstance);
        
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/user/borrowedProducts")
    public  List<Borrow> getBorrowedList(){
        List<Borrow> response = borrowService.getBorrowedItems();
        return  response;
    }

}
