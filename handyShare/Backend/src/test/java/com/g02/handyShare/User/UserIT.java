////package com.g02.handyShare.User;
////
////import com.g02.handyShare.User.Entity.User;
////import org.junit.jupiter.api.BeforeAll;
////import org.junit.jupiter.api.BeforeEach;
////import org.junit.jupiter.api.Test;
////import org.junit.jupiter.api.extension.ExtendWith;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.boot.test.context.SpringBootTest;
////import org.springframework.boot.test.web.client.TestRestTemplate;
////import org.springframework.boot.test.web.server.LocalServerPort;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.ResponseEntity;
////import org.springframework.test.context.junit.jupiter.SpringExtension;
////
////import java.util.Map;
////
////import static org.junit.Assert.assertNotNull;
////import static org.junit.jupiter.api.Assertions.assertEquals;
////import static org.junit.jupiter.api.Assertions.assertTrue;
////
////@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
////@ExtendWith(SpringExtension.class)
////public class UserIT {
////
////    @LocalServerPort
////    private int port;
////
////    @Autowired
////    private static TestRestTemplate restTemplate;
////
////    private String baseUrl = "http://localhost";
////    private String testUrl;
////
////    @BeforeAll
////    static void init(){
////        restTemplate = new TestRestTemplate();
////    }
////
////    @BeforeEach
////    void setUp() {
////        testUrl = baseUrl.concat(":").concat("8080");
////    }
////
////    @Test
////    void testReviewFlow() {
////        User registerRequest = new User("yashharjani1@yopmail.com", "12345678");
////        ResponseEntity<String> registerResponse = restTemplate.postForEntity(testUrl + "/api/v1/all/register", registerRequest, String.class);
////        registerRequest.set_email_verified(true);
////        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
////        assertTrue(registerResponse.getBody().contains("User registered successfully"));
////
//////                // Step 2: Login User and get token
//////        User loginRequest = new User("yashharjani1@yopmail.com", "12345678");
//////        ResponseEntity<Map> loginResponse = restTemplate.postForEntity("http://localhost:8080/api/v1/all/login", loginRequest, Map.class);
//////        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
//////        String authToken = (String) loginResponse.getBody().get("token");
//////        assertNotNull(authToken);
////    }
////}
//
//package com.g02.handyShare.User;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.g02.handyShare.User.Entity.User;
//import com.g02.handyShare.User.Repository.UserRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@AutoConfigureMockMvc
//@ExtendWith(SpringExtension.class)
//public class UserIT {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    public void testRegisterAndLoginFlow() throws Exception {
//        // Test data
//        User user = new User();
//        user.setEmail("test@example.com");
//        user.setPassword("password123");
//        user.setName("Test User");
//
//        // Register user
//        MvcResult registerResult = mockMvc.perform(post("/api/v1/all/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(user)))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        String registerResponse = registerResult.getResponse().getContentAsString();
//        assertTrue(registerResponse.contains("User registered successfully"));
//
//        // Simulate email verification (in a real scenario, you'd need to extract the token from the email)
//        User savedUser = userRepository.findByEmail("test@example.com");
//        assertNotNull(savedUser);
//        String verificationToken = savedUser.getVerificationToken();
//
//        mockMvc.perform(post("/api/v1/all/verifyUser")
//                        .param("token", verificationToken))
//                .andExpect(status().isOk());
//
//        // Verify user is now verified
//        savedUser = userRepository.findByEmail("test@example.com");
//        assertTrue(savedUser.is_email_verified());
//
//        // Login with registered user
//        MvcResult loginResult = mockMvc.perform(post("/api/v1/all/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(user)))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        String loginResponse = loginResult.getResponse().getContentAsString();
//        assertTrue(loginResponse.contains("token"));
//        assertTrue(loginResponse.contains("role"));
//        assertTrue(loginResponse.contains("userId"));
//    }
//}