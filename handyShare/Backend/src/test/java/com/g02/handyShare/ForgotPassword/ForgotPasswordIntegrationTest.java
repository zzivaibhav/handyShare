package com.g02.handyShare.ForgotPassword;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.g02.handyShare.User.DTO.ForgotPasswordRequest;
import com.g02.handyShare.User.Entity.User;
import com.g02.handyShare.User.Repository.UserRepository;
import com.g02.handyShare.User.Service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
class PasswordResetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmailService emailService;

    @BeforeEach
    void setup() {
        // Pre-populate a test user in the database
        User testUser = new User();
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password123");
        testUser.setName("Test User");
        testUser.setResetToken(null);
        testUser.setResetTokenExpiry(null);
        userRepository.save(testUser);
    }

    @Test
    void testForgotPassword_ValidEmail() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("testuser@example.com");

        mockMvc.perform(post("/api/v1/all/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset link sent to testuser@example.com"));
    }

    @Test
    void testForgotPassword_InvalidEmail() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("nonexistentuser@example.com");

        mockMvc.perform(post("/api/v1/all/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User not found"));
    }
}
