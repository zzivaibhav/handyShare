////package com.g02.handyShare.Review;
////
////import com.fasterxml.jackson.databind.ObjectMapper;
////import com.g02.handyShare.Review.Entity.Review;
////import com.g02.handyShare.Review.Repository.ReviewRepository;
////import org.junit.jupiter.api.BeforeEach;
////import org.junit.jupiter.api.Test;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.boot.test.context.SpringBootTest;
////import org.springframework.boot.test.web.server.LocalServerPort;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.MediaType;
////import org.springframework.test.context.ActiveProfiles;
////import org.springframework.test.context.TestPropertySource;
////import org.springframework.web.multipart.MultipartFile;
////import org.springframework.boot.test.web.client.TestRestTemplate;
////
////import java.util.List;
////
////import static org.assertj.core.api.Assertions.assertThat;
////
////@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
////@ActiveProfiles("test")
////@TestPropertySource(locations = "classpath:application-test.properties")
////public class ReviewIntegrationTest {
////
////    @LocalServerPort
////    private int port;
////
////    @Autowired
////    private TestRestTemplate restTemplate;
////
////    @Autowired
////    private ReviewRepository reviewRepository;
////
////    @Autowired
////    private ObjectMapper objectMapper;
////
////    private String baseUrl;
////
////    @BeforeEach
////    void setUp() {
////        baseUrl = "http://localhost:" + port + "/api/v1/user";
////        reviewRepository.deleteAll();
////    }
////
////    @Test
////    void testGetReviewsForProduct() {
////        // Given
////        Review review = new Review(1L, 1L, "Great product!", 5, null);
////        reviewRepository.save(review);
////
////        // When
////        String url = baseUrl + "/review-product/1";
////        var response = restTemplate.getForEntity(url, List.class);
////
////        // Then
////        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
////        assertThat(response.getBody()).isNotEmpty();
////    }
////
////    @Test
////    void testGetReviewsForUser() {
////        // Given
////        Review review1 = new Review(1L, 1L, "Amazing!", 5, null);
////        Review review2 = new Review(1L, 2L, "Good!", 4, null);
////        reviewRepository.save(review1);
////        reviewRepository.save(review2);
////
////        // When
////        String url = baseUrl + "/review-user/1";
////        var response = restTemplate.getForEntity(url, List.class);
////
////        // Then
////        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
////        assertThat(response.getBody()).isNotEmpty();
////        assertThat(response.getBody().size()).isEqualTo(2);
////    }
////
////    @Test
////    void testCreateReview() throws Exception {
////        // Given
////        String reviewText = "Excellent product!";
////        int rating = 5;
////        String url = baseUrl + "/review-create";
////
////        var requestBody = new org.springframework.util.LinkedMultiValueMap<String, String>();
////        requestBody.add("userId", "1");
////        requestBody.add("productId", "2");
////        requestBody.add("reviewText", reviewText);
////        requestBody.add("rating", String.valueOf(rating));
////
////        // When
////        var response = restTemplate.postForEntity(url, requestBody, String.class);
////
////        // Then
////        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
////        assertThat(reviewRepository.findAll().size()).isEqualTo(1);
////        Review savedReview = reviewRepository.findAll().get(0);
////        assertThat(savedReview.getReviewText()).isEqualTo(reviewText);
////        assertThat(savedReview.getRating()).isEqualTo(rating);
////    }
////}
//
////package com.g02.handyShare.Review;
////
////import com.g02.handyShare.User.Entity.User;
////import com.g02.handyShare.Review.Entity.Review;
////import com.g02.handyShare.Product.Entity.Product;
////import com.g02.handyShare.User.Repository.UserRepository;
////import com.g02.handyShare.Product.Repository.ProductRepository;
////import com.g02.handyShare.Review.Repository.ReviewRepository;
////import org.junit.jupiter.api.BeforeEach;
////import org.junit.jupiter.api.Test;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.boot.test.context.SpringBootTest;
////import org.springframework.boot.test.web.client.TestRestTemplate;
////import org.springframework.core.io.ClassPathResource;
////import org.springframework.http.*;
////import org.springframework.test.context.ActiveProfiles;
////import org.springframework.util.LinkedMultiValueMap;
////import org.springframework.util.MultiValueMap;
////
////import java.util.List;
////import java.util.Map;
////
////import static org.junit.jupiter.api.Assertions.*;
////
////@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
////@ActiveProfiles("test")
////class ReviewIntegrationTest {
////
////    @Autowired
////    private TestRestTemplate restTemplate;
////
////    @Autowired
////    private UserRepository userRepository;
////
////    @Autowired
////    private ProductRepository productRepository;
////
////    @Autowired
////    private ReviewRepository reviewRepository;
////
////    private User testUser;
////    private Product testProduct;
////    private String authToken;
////
////    @BeforeEach
////    void setUp() {
////        // Clear the database
////        reviewRepository.deleteAll();
////        productRepository.deleteAll();
////        userRepository.deleteAll();
////
////        // Create a test product
////        testProduct = new Product();
////        testProduct.setName("Laptop");
////        testProduct.setDescription("HP Laptop");
////        testProduct.setRentalPrice(100.0);
////        testProduct.setCategory("Electronics");
////        testProduct = productRepository.save(testProduct);
////    }
////
////    @Test
////    void testReviewFlow() {
////        // Step 1: Register User
////        HttpEntity<User> registerRequest = new HttpEntity<>(new User("test@example.com", "password", "Test User"));
////        ResponseEntity<String> registerResponse = restTemplate.postForEntity("/api/v1/all/register", registerRequest, String.class);
////        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
////        assertTrue(registerResponse.getBody().contains("User registered successfully"));
////
////        // Step 2: Login User and get token
////        HttpEntity<User> loginRequest = new HttpEntity<>(new User("test@example.com", "password"));
////        ResponseEntity<Map> loginResponse = restTemplate.postForEntity("/api/v1/all/login", loginRequest, Map.class);
////        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
////        authToken = (String) loginResponse.getBody().get("token");
////        assertNotNull(authToken);
////
////        // Step 3: Create Review
////        HttpHeaders headers = new HttpHeaders();
////        headers.setBearerAuth(authToken);
////        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
////
////        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
////        body.add("userId", userRepository.findByEmail("test@example.com").getId());
////        body.add("productId", testProduct.getId());
////        body.add("reviewText", "Great product!");
////        body.add("rating", 5);
////        body.add("image", new ClassPathResource("test-image.jpg"));
////
////        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
////
////        ResponseEntity<Map> createReviewResponse = restTemplate.postForEntity("/api/v1/user/review-create", requestEntity, Map.class);
////        assertEquals(HttpStatus.CREATED, createReviewResponse.getStatusCode());
////        assertEquals("Review created successfully", createReviewResponse.getBody().get("message"));
////
////        // Step 4: Get Reviews for Product
////        ResponseEntity<List> productReviewsResponse = restTemplate.exchange(
////                "/api/v1/user/review-product/" + testProduct.getId(),
////                HttpMethod.GET,
////                new HttpEntity<>(headers),
////                List.class
////        );
////        assertEquals(HttpStatus.OK, productReviewsResponse.getStatusCode());
////        List<Map<String, Object>> productReviews = productReviewsResponse.getBody();
////        assertEquals(1, productReviews.size());
////        assertEquals("Great product!", productReviews.get(0).get("reviewText"));
////        assertEquals(5, productReviews.get(0).get("rating"));
////
////        // Step 5: Get Reviews for User
////        Long userId = userRepository.findByEmail("test@example.com").getId();
////        ResponseEntity<List> userReviewsResponse = restTemplate.exchange(
////                "/api/v1/user/review-user/" + userId,
////                HttpMethod.GET,
////                new HttpEntity<>(headers),
////                List.class
////        );
////        assertEquals(HttpStatus.OK, userReviewsResponse.getStatusCode());
////        List<Map<String, Object>> userReviews = userReviewsResponse.getBody();
////        assertEquals(1, userReviews.size());
////        assertEquals("Great product!", userReviews.get(0).get("reviewText"));
////        assertEquals(5, userReviews.get(0).get("rating"));
////    }
////}
//
//package com.g02.handyShare.Review;
//
//import com.g02.handyShare.User.Entity.User;
//import com.g02.handyShare.Product.Entity.Product;
//import com.g02.handyShare.User.Repository.UserRepository;
//import com.g02.handyShare.Product.Repository.ProductRepository;
//import com.g02.handyShare.Review.Repository.ReviewRepository;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.client.TestRestTemplate;
//import org.springframework.boot.test.web.server.LocalServerPort;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.http.*;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@ExtendWith(SpringExtension.class)
//class ReviewIntegrationTest {
//
//    @LocalServerPort
//    private int port;
//
//    @Autowired
//    private static TestRestTemplate restTemplate;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ProductRepository productRepository;
//
//    @Autowired
//    private ReviewRepository reviewRepository;
//
//    private User testUser;
//    private Product testProduct;
//    private String authToken;
//    private String baseUrl = "http://localhost";
//    private String testUrl;
//
//    @BeforeAll
//    static void init(){
//        restTemplate = new TestRestTemplate();
//    }
//
//    @BeforeEach
//    void setUp() {
////        // Clear the database
////        reviewRepository.deleteAll();
////        productRepository.deleteAll();
////        userRepository.deleteAll();
//
////        // Create a test product
////        testProduct = new Product();
////        testProduct.setName("Laptop");
////        testProduct.setDescription("HP Laptop");
////        testProduct.setRentalPrice(100.0);
////        testProduct.setCategory("Electronics");
////        testProduct = productRepository.save(testProduct);
//        testUrl = baseUrl.concat(":").concat(port+"");
//    }
//
//    @Test
//    void testReviewFlow() {
//        // Step 1: Register User
////        HttpEntity<User> registerRequest = new HttpEntity<>(new User("yashharjani1@yopmail.com", "12345678"));
//        User registerRequest = new User("yashharjani1@yopmail.com","12345678");
//        ResponseEntity<String> registerResponse = restTemplate.postForEntity(testUrl+"/api/v1/all/register", registerRequest, String.class);
//        registerRequest.set_email_verified(true);
//        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
//        assertTrue(registerResponse.getBody().contains("User registered successfully"));
//
////        // Step 2: Login User and get token
////        HttpEntity<User> loginRequest = new HttpEntity<>(new User("test@example.com", "password"));
////        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(testUrl+"/api/v1/all/login", loginRequest, Map.class);
////        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
////        authToken = (String) loginResponse.getBody().get("token");
////        assertNotNull(authToken);
////
////        // Step 3: Create Review
////        HttpHeaders headers = new HttpHeaders();
////        headers.setBearerAuth(authToken);
////        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
////
////        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
////        body.add("userId", userRepository.findByEmail("test@example.com").getId());
////        body.add("productId", testProduct.getId());
////        body.add("reviewText", "Great product!");
////        body.add("rating", 5);
////        body.add("image", new ClassPathResource("test-image.jpg"));
////
////        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
////
////        ResponseEntity<Map> createReviewResponse = restTemplate.postForEntity(testUrl+"/api/v1/user/review-create", requestEntity, Map.class);
////        assertEquals(HttpStatus.CREATED, createReviewResponse.getStatusCode());
////        assertEquals("Review created successfully", createReviewResponse.getBody().get("message"));
////
////        // Step 4: Get Reviews for Product
////        ResponseEntity<List> productReviewsResponse = restTemplate.exchange(
////                testUrl+"/api/v1/user/review-product/" + testProduct.getId(),
////                HttpMethod.GET,
////                new HttpEntity<>(headers),
////                List.class
////        );
////        assertEquals(HttpStatus.OK, productReviewsResponse.getStatusCode());
////        List<Map<String, Object>> productReviews = productReviewsResponse.getBody();
////        assertEquals(1, productReviews.size());
////        assertEquals("Great product!", productReviews.get(0).get("reviewText"));
////        assertEquals(5, productReviews.get(0).get("rating"));
////
////        // Step 5: Get Reviews for User
////        Long userId = userRepository.findByEmail("test@example.com").getId();
////        ResponseEntity<List> userReviewsResponse = restTemplate.exchange(
////                testUrl+"/api/v1/user/review-user/" + userId,
////                HttpMethod.GET,
////                new HttpEntity<>(headers),
////                List.class
////        );
////        assertEquals(HttpStatus.OK, userReviewsResponse.getStatusCode());
////        List<Map<String, Object>> userReviews = userReviewsResponse.getBody();
////        assertEquals(1, userReviews.size());
////        assertEquals("Great product!", userReviews.get(0).get("reviewText"));
////        assertEquals(5, userReviews.get(0).get("rating"));
//    }
//}