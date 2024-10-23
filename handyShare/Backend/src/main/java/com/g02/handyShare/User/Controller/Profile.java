package com.g02.handyShare.User.Controller;

import com.g02.handyShare.Config.CustomUserDetailsService;
import com.g02.handyShare.Config.Jwt.JwtUtil;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import com.g02.handyShare.User.Service.ProfileService;
import com.g02.handyShare.User.Service.UserService;


import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


//API starting with /all are accessible by all.
//API starting with /user are accessible by user and admin both.
//API starting with /admin are accessible by admin only.

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class Profile {

    @Autowired
    private UserService userService;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    UserRepository repo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProfileService profileService;
    
   @GetMapping("user/getUser")
   public ResponseEntity<?> fetchUser(){
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
     

        User response = profileService.getUser(userName);
       
        return ResponseEntity.ok().body(response);
   }

   @PutMapping("/user/update-profile")
    public ResponseEntity<?> updateUser(@RequestParam("profileImage") MultipartFile file, 
                                        @RequestParam("name") String name,
                                        @RequestParam("address") String address,
                                        @RequestParam("pincode") String pincode,
                                        @RequestParam("phone") String phone
                                        ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = new User();
        user.setName(name);
        user.setPincode(pincode);
        user.setAddress(address);
        user.setPhone(phone);                                   
        ResponseEntity<?> response = profileService.modifyUser(file, user, email, "user_profile_pictures");
        return ResponseEntity.ok().body(response);
    }

}
