package com.g02.handyShare.Config.Jwt;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g02.handyShare.Config.CustomUserDetailsService;
import com.g02.handyShare.User.Entity.User;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class JwtController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    JwtUtil jwtUtil;


  
@PostMapping("/all/genToken")
public String genToken(@RequestBody User user){
    System.out.println("Received request with email: " + user.getEmail());
    
    try {
        // Log the authentication process
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        System.out.println("Authentication successful for: " + user.getEmail());
    } catch (Exception e) {
        System.out.println("Authentication failed: " + e.getMessage());
        throw e;  // Re-throw to ensure the client receives the error
    }
    
    UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
    String jwt = jwtUtil.generateToken(userDetails.getUsername());
    System.out.println("JWT generated: " + jwt);
    return jwt;
}





}
