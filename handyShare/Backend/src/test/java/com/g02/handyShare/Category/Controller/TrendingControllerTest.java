//package com.g02.handyShare.Category.Controller;
//
//import com.g02.handyShare.Category.DTO.ProductIDRequest;
//import com.g02.handyShare.Category.Entity.Trending;
//import com.g02.handyShare.Category.Service.TrendingService;
//import com.g02.handyShare.Product.Entity.Product;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.ResponseEntity;
//
//import java.util.Arrays;
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//
//class TrendingControllerTest {
//
//    @Mock
//    private TrendingService trendingService;
//
//    @InjectMocks
//    private TrendingController trendingController;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testGetTrendingByCategory() {
//        // Create sample trending list
//        Trending trending1 = new Trending();
//        trending1.setId(1L);
//        trending1.setProduct(new Product());
//
//        Trending trending2 = new Trending();
//        trending2.setId(2L);
//        trending2.setProduct(new Product());
//
//        List<Trending> trendingList = Arrays.asList(trending1, trending2);
//
//        // Mock the service method
//        when(trendingService.fetchTrendingsByCategory(anyString())).thenReturn(ResponseEntity.ok(trendingList));
//
//        // Call the controller method
//        ResponseEntity<?> response = trendingController.getTrendingByCategory("electronics");
//
//        // Validate the result
//        assertNotNull(response);
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(trendingList, response.getBody());
//    }
//
//    @Test
//    void testAddToTrending() {
//        // Setup product ID and request
//        Long productId = 1L;
//        ProductIDRequest request = new ProductIDRequest();
//        request.setProduct_id(productId);
//
//        // Create a sample trending entity
//        Trending trending = new Trending();
//        trending.setId(1L);
//        Product product = new Product();
//        product.setId(productId);
//        trending.setProduct(product);
//
//        // Mock the service method
//        when(trendingService.addToTrending(productId)).thenReturn(trending);
//
//        // Call the controller method
//        ResponseEntity<?> response = trendingController.addToTrending(request);
//
//        // Validate the result
//        assertNotNull(response);
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals(trending, response.getBody());
//    }
//
//    @Test
//    void testAddToTrending_ProductNotFound() {
//        // Setup product ID and request
//        Long productId = 1L;
//        ProductIDRequest request = new ProductIDRequest();
//        request.setProduct_id(productId);
//
//        // Mock the service method to throw exception
//        when(trendingService.addToTrending(productId)).thenThrow(new RuntimeException("Product not found with id: " + productId));
//
//        // Call the controller method and assert exception handling
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
//            trendingController.addToTrending(request);
//        });
//
//        assertEquals("Something went wrong while adding the product to the trending table: Product not found with id: 1", exception.getMessage());
//    }
//}
