package com.g02.handyShare.User.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;

@Service
public class ProfileService {
    @Autowired
    private UserRepository repo;
    public User getUser(String email) {
        
        User response = repo.findByEmail(email);
        return response;
    }

}
