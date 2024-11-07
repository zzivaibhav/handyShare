package com.g02.handyShare.User.Controller;

import com.g02.handyShare.User.DTO.ForgotPasswordRequest;
import com.g02.handyShare.User.Service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/all")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return passwordResetService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam("token") String token, @RequestBody String newPassword) {
        return passwordResetService.resetPassword(token, newPassword);
    }
}