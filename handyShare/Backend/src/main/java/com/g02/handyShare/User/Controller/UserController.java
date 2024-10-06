package com.g02.handyShare.User.Controller;


import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("save")
    public User saveUser(@RequestBody User request) {
       return userService.saveUser(request) ;
    }
}
