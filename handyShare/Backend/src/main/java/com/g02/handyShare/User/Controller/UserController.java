package com.g02.handyShare.User.Controller;

import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import com.g02.handyShare.User.Service.UserService;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// API access rules
// /all -> accessible by all
// /user -> accessible by user and admin
// /admin -> accessible by admin only

@RestController
 @RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    UserRepository repo;


        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        } else {
            String result = userService.registerUser(user);

            if (result.contains("already registered")) {
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);
        }
    }

    @GetMapping("/all/admin/getUser") // Accessible by ADMIN only
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok().body(users);
    }

    @PostMapping("/perform_login")
    public String login(){
        return "loggedin";
    }

    @GetMapping("/all/verifyUser")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        String response = userService.verifyUser(token);
        if(response.contains("Successfully")){
            return ResponseEntity.ok().body("Email is successfully verified !!!");
        }

        return ResponseEntity.badRequest().body("Invalid or expired token.");
    }

    @GetMapping("/all/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId){
        if(userId == null){
            return ResponseEntity.badRequest().body("User ID cannot be null.");
                // Start of Selection
                }

                Optional<User> userOpt = repo.findById(userId);
                if(userOpt.isPresent()){
                        // Start of Selection
                        return ResponseEntity.ok(userOpt.get());
                    } else {
                        return ResponseEntity.status(404).body("User not found with ID: " + userId);
                }
        }
    }
