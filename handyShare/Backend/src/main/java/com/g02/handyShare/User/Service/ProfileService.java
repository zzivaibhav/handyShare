package com.g02.handyShare.User.Service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.g02.handyShare.Config.Firebase.FirebaseService;
import com.g02.handyShare.User.DTO.PasswordChangeRequest;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import com.google.firebase.auth.hash.Bcrypt;

@Service
public class ProfileService {
    @Autowired
    private UserRepository repo;

    private FirebaseService firebaseService;

    @Autowired
    public void Controller(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @Autowired
    BCryptPasswordEncoder encoder;
    public User getUser(String email) {
        
        User response = repo.findByEmail(email);
        return response;
    }
    public ResponseEntity<?> modifyUser(MultipartFile file, User user, String email, String path) {
        User existingUser = repo.findByEmail(email);
        try {
            String imageUrl = firebaseService.uploadFile(file, path);
            
            existingUser.setName(user.getName());
            existingUser.setPincode(user.getPincode());
            existingUser.setAddress(user.getAddress());
            existingUser.setPhone(user.getPhone());
            existingUser.setImageData(imageUrl);

            repo.save(existingUser);
            return ResponseEntity.ok().body("Profile updated successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }

    public String changePassword(PasswordChangeRequest request, String email) {
      
        User existingUser = repo.findByEmail(email);
        
        Boolean response = encoder.matches(request.getCurrentPassword(),existingUser.getPassword() );

        if(response){
            existingUser.setPassword(encoder.encode(request.getNewPassword()));
            repo.save(existingUser);
            return "Password changed successfully";
        }

        return "Unauthorized operations";
    }
}


